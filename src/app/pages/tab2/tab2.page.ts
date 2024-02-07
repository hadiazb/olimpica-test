import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';

import { Howl } from 'howler';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab2Page implements OnInit {
  public audio?: Howl;
  constructor() {}

  ngOnInit(): void {
    this.audio = new Howl({
      src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/OLP_BOGOTAAAC.aac?dist=oro_web',
      html5: true,
      preload: true,
      onplayerror: (soundId, err) => {
        console.log({ soundId, err });
        alert(`${err} - ${soundId}`);
        this.audio?.play();
      },
    });
  }

  public start() {
    if (!this.audio) {
      return;
    }

    const resp = this.audio.play();

    console.log({ resp });
  }

  public stop() {
    if (!this.audio) {
      return;
    }

    const resp2 = this.audio.pause();
    console.log({ resp2 });
  }
}
