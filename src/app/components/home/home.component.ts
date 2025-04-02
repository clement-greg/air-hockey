import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, NgZone, OnDestroy } from '@angular/core';
import { Game } from '../../models/game';
import { MatButtonModule } from '@angular/material/button';
import { GameMessage } from '../../models/game-message';
import { GameSetupComponent } from '../game-setup/game-setup.component';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';
import { PubSubService } from '../../services/pub-sub.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { PongComponent } from '../pong/pong.component';
import { JoystickState } from '../../services/joystick-state';
import { CountDownComponent } from '../count-down/count-down.component';
import { LeaderBoardRepositoryService } from '../../services/leader-board-repository.service';
import { DisplayGameResultComponent } from '../display-game-result/display-game-result.component';
import { LeaderBoardComponent } from '../leader-board/leader-board.component';
import { LottiePlayerComponent } from '../lottie-player/lottie-player.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, GameSetupComponent, CountDownComponent, LottiePlayerComponent, MatIconModule, DisplayGameResultComponent, CommonModule, SettingsComponent, PongComponent, LeaderBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {

  game: Game;
  interval: any;
  private subscription: Subscription;
  joystick1State = new JoystickState(0);
  joystick2State = new JoystickState(1);
  private messageDates: any = {};


  constructor(zone: NgZone,
    pubSub: PubSubService,
    private sanitizer: DomSanitizer,
    leaderboard: LeaderBoardRepositoryService) {

    this.game = new Game(leaderboard);
    window.addEventListener('message', event => {
      const gameMessage: GameMessage = JSON.parse(event.data);

      zone.run(() => {
        // Prevent the same event from signaling twice
        let lastMessageReceived: Date = this.messageDates[gameMessage.messageType];
        if (!lastMessageReceived) {
          lastMessageReceived = new Date(2000, 1, 1);
        }
        const miliseconds = new Date().getTime() - lastMessageReceived.getTime();
        if (miliseconds > 2000) {
          this.processGameMessage(gameMessage);
          this.messageDates[gameMessage.messageType] = new Date();
        }
      });
    });

    this.subscription = pubSub.subscription.subscribe(message => {
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
    this.joystick2State.onButtonPress = this.joystickButtonPress.bind(this);
  }

  private joystickButtonPress(index: number) {
    if (index === 0) {
      this.game?.handleSpace();
    }
    if(index === 9 && this.showEmbeddedGame) {
      this.showEmbeddedGame = false;
      this.game.gameSetup = true;
    }
  }

  get bgVideo() {
    if(this.game.introMode) {
      return '../../assets/video/dark-intro.mp4';
    }

    return '../../assets/video/dark-bg.mp4'
  }

  get isFlashing() {
    if (typeof this.game.secondsRemaining != 'number') {
      return false;
    }
    return this.game.secondsRemaining <= 10 && this.game.secondsRemaining > 0;
  }

  setupCancelled() {
    this.game.gameSetup = false;
    this.game.introMode = true;
  }

  gamepads: any = {};
  gamepadHandler(event: any, connected: boolean) {
    const gamepad = event.gamepad;

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
    if (this.game.settingsVisible) {
      return;
    }

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
        if (!this.game.running) {
          this.game.settingsVisible = true;
        }
        break;
      case 'b':
        if (this.game.introMode) {
          this.game.showLeaderboard = !this.game.showLeaderboard;
        } else {
          this.game.settingsVisible = false;
        }
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
  }

  showEmbeddedGame  = false;
  embeddedGameUrl: any;
  configChange() {
    if(this.game.config.gameType === 'AZ' || this.game.config.gameType === 'UT' || this.game.config.gameType === 'NV') {
      this.showEmbeddedGame = true;
      this.game.gameSetup = false;
      this.embeddedGameUrl = this.sanitizer.bypassSecurityTrustResourceUrl( `https://elevate-game-gjbmgwdegjb7eza2.westus-01.azurewebsites.net/?state=${this.game.config.gameType}`);
      setTimeout(()=> {
        document.getElementById('external-game-iframe').focus();
      }, 500);
      return;
    }
    this.game.gameSetup = false;
    this.game.restart();


    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.game.loop();
    }, 50);
  }
}
