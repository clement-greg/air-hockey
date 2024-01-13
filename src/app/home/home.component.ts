import { Component, HostListener, NgZone } from '@angular/core';
import { Game, GameSetupConfig } from '../game';
import { MatButtonModule } from '@angular/material/button';
import { GameMessage } from '../game-message';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { CommonModule } from '@angular/common';
import { DisplayWinnerComponent } from '../display-winner/display-winner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, GameSetupComponent, CommonModule, DisplayWinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  game = new Game(10);
  interval: any;
  gameSetup = false;
  config: GameSetupConfig = new GameSetupConfig();

  constructor(zone: NgZone) {
    window.addEventListener('message', event=> {
      console.log("Message received from the parent: " + event.data); // Message received from parent
      const gameMessage: GameMessage = JSON.parse(event.data);

      zone.run(()=> {
        this.processGameMessage(gameMessage);
      });

    });
    this.launchVideo();
  }

  launchVideo() {
    const video: any = document.getElementById('bg-video');
    if(!video) {
      setTimeout(()=> this.launchVideo(), 100);
    } else {
      console.log('playing')
      video.mutued = true;
      video.play();
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyPress(evt: KeyboardEvent) {
    switch (evt.key) {
      case ' ':
        this.handleSpace();
        break;
    }
  }

  handleSpace() {
    if(this.game?.winner) {
      delete this.game?.winner;
      this.startGame();
    }
  }

  processGameMessage(message: GameMessage) {
    this.game.processGameMessage(message);
    if(message.messageType === 'GAME_STARTED') {
      this.startGame();
    }
  }

  configChange() {
    this.gameSetup = false;
    this.game.restart();
    this.game.player1 = this.config.player1;
    this.game.player2 = this.config.player2;

    clearInterval(this.interval);
    this.interval = setInterval(()=> {
      this.game.loop();
    }, 50);
  }

  startGame() {
    delete this.game.winner;
    this.config = new GameSetupConfig();
    this.game = new Game(10);
    this.gameSetup = true;
    const video: any = document.getElementById('bg-video');
    video.play();
  }
}
