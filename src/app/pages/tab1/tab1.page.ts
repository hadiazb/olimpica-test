import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';

import { Howl } from 'howler';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab1Page implements OnInit {
  public audio?: HTMLAudioElement;
  public audio2?: Howl;

  constructor() {}

  ngOnInit(): void {
    this.audio = new Audio(
      'https://playerservices.streamtheworld.com/api/livestream-redirect/OLP_BOGOTAAAC.aac?dist=oro_web'
    );
    this.audio?.load();
  }

  public async start() {
    if (!this.audio) {
      return;
    }

    await this.audio.play();
  }

  public async stop() {
    if (!this.audio) {
      return;
    }

    await this.audio.pause();
  }
}
