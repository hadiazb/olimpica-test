import { EventEmitter, Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  private sound?: Howl;
  private url!: string;

  audioLoadedEvent = new EventEmitter<Object>(); // EventEmitter para emitir eventos de carga de audio
  audioevtEvent: any;

  constructor() {
    Howler.autoUnlock = true;
    Howler.autoSuspend = false; // Mantener una reproduccion continua

    // Escuchar el evento 'online'
    window.addEventListener('online', () => {
      console.log('Conexión a Internet restablecida');
      // Aquí puedes realizar acciones adicionales, como reanudar la reproducción de audio si estaba pausada debido a la pérdida de conexión.
      this.restartPlayback();
    });

    // Escuchar el evento 'offline'
    window.addEventListener('offline', () => {
      console.log('Conexión a Internet perdida');
      // Aquí puedes realizar acciones adicionales, como pausar la reproducción de audio si estaba en curso.
    });
  }

  loadStream(url: string) {
    this.url = url;
    this.sound = new Howl({
      src: [this.url],
      format: ['aac'],
      html5: true,
      onplayerror: (soundId, err) => {
        console.log('Audio error :>> ', err);
        this.restartPlayback();
      },
      onload: () => {
        console.log('Audio cargado [OK]');
        // Realiza acciones adicionales después de cargar la reproducción
        // console.log('Howler :>> ', Howler);
        // this.audioLoadedEvent.emit(this.sound?.state()); // Emite un evento cuando el audio se carga completamente
      },
      onloaderror: (soundId, err) => {
        console.error('# Error al cargar el audio:', err);
        // Aquí puedes realizar acciones adicionales, como notificar al usuario sobre el error.
        this.restartPlayback();
      },
      onpause: (soundId) => {
        console.log('Audio pausado:', soundId);
        // Realiza acciones adicionales después de pausar la reproducción
      },
      onplay: (soundId) => {
        console.log('Audio Play:', soundId);
        this.audioLoadedEvent.emit({state: this.sound?.state()}); // Emite un evento cuando el audio se empieza a reproducir
      }
    });
  }

  playStream() {
    this.sound?.play();
  }

  pauseStream() {
    this.sound?.pause();
  }
  
  stopStream() {
    this.sound?.stop();
  }

  getState() {
    console.log(`AUDIO STATE [${this.sound?.state()}]`);
  }

  restartPlayback() {
    console.log('Restart :>> Hay una instacia de audio activa...');
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = undefined;
      this.loadStream(this.url); // Vuelve a cargar la reproducción
      this.playStream();
    }
  }
}
