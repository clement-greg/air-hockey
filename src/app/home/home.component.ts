import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, NgZone } from '@angular/core';
import { Game, GameSetupConfig } from '../game';
import { MatButtonModule } from '@angular/material/button';
import { GameMessage } from '../game-message';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { CommonModule } from '@angular/common';
import { DisplayWinnerComponent } from '../display-winner/display-winner.component';
import { DisplayTieComponent } from '../display-tie/display-tie.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, GameSetupComponent, CommonModule, DisplayWinnerComponent, DisplayTieComponent],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  game = new Game(60);
  interval: any;

  constructor(zone: NgZone) {
    window.addEventListener('message', event => {
      const gameMessage: GameMessage = JSON.parse(event.data);

      zone.run(() => {
        this.processGameMessage(gameMessage);
      });

    });
    this.launchVideo();
  }

  launchVideo() {
    const video: any = document.getElementById('bg-video');
    if (!video) {
      setTimeout(() => this.launchVideo(), 100);
    } else {
      video.mutued = true;
      video.play();


    }
  }

  @HostListener('document:keyup', ['$event'])
  keyPress(evt: KeyboardEvent) {
    switch (evt.key) {
      case ' ':
        this.game?.handleSpace();
        break;

      case 'l':
        this.processGameMessage({
          sender: 'Server',
          messageType: 'PLAYER_1_SCORED'
        });
        break;
      case 'r':
        this.processGameMessage({
          sender: 'Server',
          messageType: 'PLAYER_2_SCORED'
        });
        break;

    }
  }

  processGameMessage(message: GameMessage) {
    this.game.processGameMessage(message);
    if (message.messageType === 'GAME_STARTED') {
      this.game.startGame();
    }
  }

  configChange() {
    this.game.gameSetup = false;
    this.game.restart();
    const bgAudio: any = document.getElementById('bg-music');
    bgAudio.pause();
    const gameAudio: any = document.getElementById('arcade-funk');
    gameAudio.volume = .05;
    gameAudio.currentTime = 0;
    gameAudio.play();


    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.game.loop();
    }, 50);
  }


}
