import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, NgZone, OnDestroy } from '@angular/core';
import { Game } from '../../models/game';
import { MatButtonModule } from '@angular/material/button';
import { GameMessage } from '../../models/game-message';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { CommonModule } from '@angular/common';
import { DisplayWinnerComponent } from '../display-winner/display-winner.component';
import { DisplayTieComponent } from '../display-tie/display-tie.component';
import { SettingsComponent } from '../settings/settings.component';
import { PubSubService } from '../../services/pub-sub.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { PongComponent } from '../pong/pong.component';
import { JoystickState } from '../../models/player';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, GameSetupComponent, MatIconModule, CommonModule, DisplayWinnerComponent, DisplayTieComponent, SettingsComponent, PongComponent],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {

  game = new Game(60);
  interval: any;
  private subscription: Subscription;
  joystick1State = new JoystickState(0);
  private lastMessageReceived: Date = new Date();

  constructor(zone: NgZone, private pubSub: PubSubService) {
    window.addEventListener('message', event => {
      const gameMessage: GameMessage = JSON.parse(event.data);

      zone.run(() => {
        const miliseconds = new Date().getTime() - this.lastMessageReceived.getTime();
        if (miliseconds > 2000) {
          this.processGameMessage(gameMessage);
          this.lastMessageReceived = new Date();
        }
      });

    });

    this.subscription = pubSub.subscription.subscribe(message => {
      console.log(message)
      if (message.type === 'PLAYER_1_SCORED') {

        this.processGameMessage({
          sender: 'Server',
          messageType: 'PLAYER_1_SCORED'
        });
      } if (message.type === 'PLAYER_2_SCORED') {
        this.processGameMessage({
          sender: 'Server',
          messageType: 'PLAYER_2_SCORED'
        });
      }

    });
    this.joystick1State.onButtonPress = this.joystickButtonPress.bind(this);
  }

  private joystickButtonPress(index: number) {
    if (index === 0) {
      this.game?.handleSpace();
    }
  }

  gamepads: any = {};
  gamepadHandler(event: any, connected: boolean) {
    const gamepad = event.gamepad;
    // Note:
    // gamepad === navigator.getGamepads()[gamepad.index]

    if (connected) {
      this.gamepads[gamepad.index] = gamepad;
    } else {
      delete this.gamepads[gamepad.index];
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      case 's':
        this.game.settingsVisible = true;
        break;
      case 'b':
        this.game.settingsVisible = false;
        break;
      case 'p':

        if (this.game.running) {
          this.game.playPong = true;
        }
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
