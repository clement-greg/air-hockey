import { Component, NgZone } from '@angular/core';
import { Game } from '../game';
import { MatButtonModule } from '@angular/material/button';
import { GameMessage } from '../game-message';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  game = new Game(10);
  interval: any;

  constructor(zone: NgZone) {
    window.addEventListener('message', event=> {
      console.log("Message received from the parent: " + event.data); // Message received from parent
      const gameMessage: GameMessage = JSON.parse(event.data);

      zone.run(()=> {
        this.processGameMessage(gameMessage);
      });

    });
  }

  processGameMessage(message: GameMessage) {
    this.game.processGameMessage(message);
  }

  startGame() {
    this.game.restart();
    clearInterval(this.interval);
    this.interval = setInterval(()=> {
      this.game.loop();
    }, 50);
  }
}
