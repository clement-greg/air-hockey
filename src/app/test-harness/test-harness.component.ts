import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { GameMessage } from '../game-message';

@Component({
  selector: 'app-test-harness',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './test-harness.component.html',
  styleUrl: './test-harness.component.scss'
})
export class TestHarnessComponent {

  constructor(protected _sanitizer: DomSanitizer) {
    console.log(document.location)
  }

  private _origin: any;
  get orgin() {
    if(!this._origin) {
      this._origin = this._sanitizer.bypassSecurityTrustResourceUrl(document.location.origin);
    }
    return this._origin;
  }

  sendPlayerScore(playerNumber: number) {
    this.sendMessage({
      sender: 'Server',
      messageType: playerNumber === 1 ? 'PLAYER_1_SCORED' : 'PLAYER_2_SCORED',
    });
  }

  startGame() {
    this.sendMessage({
      sender: 'Server',
      messageType: 'GAME_STARTED'
    });
    const iframe = document.querySelector("iframe");
    iframe.focus();
  }

  sendMessage(message:GameMessage) {
    const iframe = document.querySelector("iframe");
    (iframe as any).contentWindow.postMessage (JSON.stringify(message), "*");
  }
}
