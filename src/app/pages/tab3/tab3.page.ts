import { Component, OnInit } from '@angular/core';
import { StreamingService } from 'src/app/services/streaming.service';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, IonButton, IonButtons, IonLoading, LoadingController, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle, IonCard } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  providers: [
    ForegroundService // Agrega el servicio al array de proveedores
  ],
  imports: [IonCard, IonCardTitle, IonCardContent, IonCardSubtitle, IonCardHeader, 
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
  isPlaying: any;
  loading: HTMLIonLoadingElement | null = null;
  loadingIsOpen: any; // Controla la vista del modal de carga
  disableReset: Boolean = true;

  constructor(
    private streamingService: StreamingService,
    private loadingController: LoadingController,
    private foregroundService: ForegroundService
  ) { }

  ngOnInit(): void {
    console.log('Cargando audio [...]');
    // this.mostrarCarga();
    this.streamingService.loadStream('https://playerservices.streamtheworld.com/api/livestream-redirect/OLP_BOGOTAAAC.aac?dist=oro_web');
    // Suscribe al evento de carga de audio
    this.streamingService.audioLoadedEvent.subscribe((evt: any) => {
      console.log(`AUDIO STATE OBS [${evt.state}]`);
      if (evt.state === 'loaded') {
        console.log('Audio cargado completamente');
        // Aquí puedes realizar las acciones que necesites cuando el audio se cargue completamente
        this.ocultarCarga(); // Por ejemplo, ocultar el indicador de carga
      } else if (evt.state === 'reset') {
        this.mostrarCarga();
      }
    });
  }

  play() {
    this.mostrarCarga();
    this.streamingService.playStream();
    this.isPlaying = true;
    this.disableReset = false;
    this.foregroundService.start('Olimpica Stereo', 'Reproduciendo');
  }

  pause() {
    this.isPlaying = false;
    this.streamingService.pauseStream();
    this.foregroundService.stop();
  }

  state() {
    this.streamingService.getState();
  }

  reset() {
    this.streamingService.restartPlayback();
    this.isPlaying = true;
  }

  async mostrarCarga() {
    if (!this.loading) {
      this.loading = await this.loadingController.create();
      await this.loading.present();
    }
    this.loadingIsOpen = true;
  }

  async ocultarCarga() {
    await this.loading?.dismiss();
    this.loadingIsOpen = false;
  }
}
