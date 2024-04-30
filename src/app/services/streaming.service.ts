import { EventEmitter, Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  private sound?: Howl;
  private url!: string;

  audioLoadedEvent = new EventEmitter<Object>(); // EventEmitter para emitir eventos de cambio de estado de la instancia del audio
  audioevtEvent: any;

  constructor() {
    Howler.autoUnlock = true;
    Howler.autoSuspend = false; // Mantener una reproduccion continua

    // Escuchar el evento 'online'
    window.addEventListener('online', () => {
      console.log('Conexión a Internet restablecida');
      // Aquí puedes realizar acciones adicionales, como reanudar la reproducción de audio si estaba pausada debido a la pérdida de conexión.
      this.restartPlayback(); // reinicia la instancia del audio para reconectar la reproducción
    });

    // Escuchar el evento 'offline'
    window.addEventListener('offline', () => {
      console.log('Conexión a Internet perdida');
    });
  }

  // Funcion para montar instancia de audio
  loadStream(url: string) {
    this.url = url;
    this.sound = new Howl({
      src: [this.url],
      format: ['aac'],
      html5: true,
      onplayerror: (soundId, err) => {
        // Aquí puedes realizar acciones adicionales en respuesta al error de reproducción,
        // como mostrar un mensaje de error al usuario, registrar el error, etc.
        console.log('[onplayerror] :>> ', err);
        this.restartPlayback();
      },
      onload: () => {
        // Realiza acciones adicionales después de cargar el archivo de reproducción
        console.log('Archivo de audio cargado [OK]');
      },
      onloaderror: (soundId, err) => {
        console.error('[onloaderror] No. Error al cargar el audio :>> ', err);
        this.restartPlayback(); // Reiniciamos la instancia del audio
      },
      onpause: (soundId) => {
        // Realiza acciones adicionales después de pausar la reproducción
        console.log(`Audio pausado [Instance ${soundId}]`);
      },
      onplay: (soundId) => {
        console.log(`Audio play [Instance ${soundId}]`);
        this.audioLoadedEvent.emit({state: this.sound?.state()}); // Emite un evento cuando el audio se empieza a reproducir
      },
      onend: (soundId) => {
        console.log(`Audio End [Instance ${soundId}] --> ${this.sound?.state()}`);
      },
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
    console.log(`Audio state [${this.sound?.state()}]`);
  }

  restartPlayback() {
    this.audioLoadedEvent.emit({state: 'reset'}); // Emite un evento cuando se reinicia la instancia del audio
    if (this.sound) {
      this.sound.stop(); // Detiene el audio
      this.sound.unload(); // Desmonta la instancia actual
      this.sound = undefined;
      this.loadStream(this.url); // Vuelve a cargar la reproducción [Montar instancia de audio]
      this.playStream();
    }
  }
}
