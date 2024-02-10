import { Component, OnInit } from '@angular/core';
import { StreamingService } from 'src/app/services/streaming.service'; // Servicio para manejar eventos del audio
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonLoading,
  LoadingController,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonCard, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  providers: [
    ForegroundService, // Agrega el servicio al array de proveedores
  ],
  imports: [
    CommonModule,
    IonIcon, 
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonLoading,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab3Page implements OnInit {
  isPlaying: any; // Manejador de eventos del btn play/pause
  loadingCtrl: HTMLIonLoadingElement | null = null; // Instancia del modal de loading
  loadingIsOpen: any; // Controla la vista del modal de carga
  disableReset: Boolean = true; // Manejador de eventos del btn Reset

  constructor(
    private streamingService: StreamingService,
    private loadingController: LoadingController,
    private foregroundService: ForegroundService
  ) {}

  ngOnInit(): void {
    console.log('Cargando audio [...]');
    this.streamingService.loadStream(
      'https://playerservices.streamtheworld.com/api/livestream-redirect/OLP_BOGOTAAAC.aac?dist=oro_web'
    );
    // Se suscribe al observable para saber el estado de la instancia del audio
    this.streamingService.audioLoadedEvent.subscribe((evt: any) => {
      console.log(`Audio state...observable [${evt.state}]`);
      if (evt.state === 'loaded') {
        this.isPlaying = true;
        this.disableReset = false;
        this.ocultarCarga(); // Oculta el modal de loading
        this.putExecutionBackground(); // Activa ejecución en segundo plano del audio
        console.log('Audio cargado completamente [OK]');
      } else if (evt.state === 'reset') {
        this.mostrarCarga();
        this.isPlaying = false;
        this.stopExecutionBackground(); // Detiene ejecución en segundo plano del audio
        console.log('Reiniciar instancia de audio activa [RESTART]');
      }
    });
  }

  play() {
    this.mostrarCarga();
    this.streamingService.playStream(); // Ejecuta evento play
  }

  // Activar ejecución del audio en segundo plano
  putExecutionBackground() {
    try {
      this.foregroundService.start('Olimpica Stereo', 'Reproduciendo', undefined, 3);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  // Finalizar ejecución del audio en segundo plano
  stopExecutionBackground() {
    try {
      this.foregroundService.stop();
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  pause() {
    this.isPlaying = false;
    this.streamingService.pauseStream();
    this.stopExecutionBackground();
  }

  state() {
    this.streamingService.getState();
  }

  reset() {
    this.streamingService.restartPlayback();
  }

  async mostrarCarga() {
    if (!this.loadingCtrl) {
      this.loadingCtrl = await this.loadingController.create();
      await this.loadingCtrl.present();
    }
    this.loadingIsOpen = true;
  }

  async ocultarCarga() {
    await this.loadingCtrl?.dismiss();
    this.loadingIsOpen = false;
  }
}
