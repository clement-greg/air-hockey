import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { GameSetupConfig } from '../../models/game-setup-config';
import { GameType } from '../../models/game-type';
import { JoystickState } from '../../services/joystick-state';
import { PlayerAvatar } from '../../models/player-avatar';
import { playMusic } from '../../services/utilities';
import { LeaderBoardRepositoryService } from '../../services/leader-board-repository.service';
import { LottiePlayerComponent } from '../lottie-player/lottie-player.component';
import { PlayerRepository } from '../../services/player-repository.service';
import { Game } from '../../models/game';



@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, LottiePlayerComponent],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnChanges, OnDestroy {
  selectedItem: PlayerAvatar;

  @Input() config: GameSetupConfig = new GameSetupConfig();
  @Output() configChange: EventEmitter<GameSetupConfig> = new EventEmitter();

  @Output() setupCancelled: EventEmitter<boolean> = new EventEmitter();
  @Input() game: Game;
  private joystick1 = new JoystickState(0);
  private joystick2 = new JoystickState(1);
  gameTypeSelected = false;
  gameTypes: GameType[] = [
    { type: 'Virtual', lottieUrl: 'https://lottie.host/2624709a-b10c-43e1-af2a-623d1434c3b3/HhWUwa1d3c.json', description: 'Play pong using the joysticks' },
    { type: 'Physical', lottieUrl: 'https://lottie.host/063f9150-34fc-4bdc-92df-16318a0f3a79/xG6AAyhFbC.json', description: 'Play air hockey on the real table' },
    { type: 'Both', lottieUrl: 'https://lottie.host/a7044b1d-7b7c-4dbe-8c08-f8579798acd4/pnWDVXLTWJ.json', description: 'Play both pong and the real table simultaneously' },
    // { type: 'AZ', lottieUrl: 'https://lottie.host/e7bc1a5a-32bd-4ad9-8350-d92e73322f69/le7yEpIimV.json', description: 'Play AZ' },
    // { type: 'UT', lottieUrl: 'https://lottie.host/2624709a-b10c-43e1-af2a-623d1434c3b3/HhWUwa1d3c.json', description: 'Play UT' },
    // { type: 'NV', lottieUrl: 'https://lottie.host/2624709a-b10c-43e1-af2a-623d1434c3b3/HhWUwa1d3c.json', description: 'Play NV' },
  ];

  constructor(private leaderboardRepository: LeaderBoardRepositoryService) {
    this.selectedItem = this.playerTypes[14];
    this.joystick1.onLeftJoyStick = this.player1SelectLeft.bind(this);
    this.joystick1.onRightJoyStick = this.player1SelectRight.bind(this);
    this.joystick1.onButtonPress = this.player1ButtonPress.bind(this);
    this.joystick2.onLeftJoyStick = this.player2SelectLeft.bind(this);
    this.joystick2.onRightJoyStick = this.player2SelectRight.bind(this);
    this.joystick2.onButtonPress = this.player2ButtonPress.bind(this);
  }
  ngOnDestroy(): void {
    this.joystick1.onLeftJoyStick = null;
    this.joystick1.onRightJoyStick = null;
    this.joystick1.onButtonPress = null;
    this.joystick2.onLeftJoyStick = null;
    this.joystick2.onRightJoyStick = null;
    this.joystick2.onButtonPress = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'].currentValue) {
      const gc: GameSetupConfig = changes['config'].currentValue;
      if (!gc.gameType) {
        gc.gameType = 'Physical';
      }
      if (gc.player1 && gc.player2 && gc.gameType) {
        this.gameTypeSelected = true;
      }
    }
  }

  get selectedGameType() {
    return this.gameTypes.find(i => i.type === this.config.gameType);
  }

  player1ButtonPress(buttonNumber: number) {
    if (this.game.running) {
      return;
    }
    if (this.config.player1 && !this.config.player2 && buttonNumber === 0) {
      return;
    }
    this.buttonPress(buttonNumber);
  }

  player2ButtonPress(buttonNumber: number) {
    if (this.game.running) {
      return;
    }
    if (!this.config.player1 && buttonNumber === 0) {
      return;
    }
    this.buttonPress(buttonNumber);
  }

  buttonPress(buttonNumber: number) {
    if (buttonNumber === 0) {
      this.selectAvatar();
    }
    if (buttonNumber === 1) {
      this.back();
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyPress(evt: KeyboardEvent) {

    switch (evt.key) {
      case 'ArrowRight':
        this.selectRight();
        break;
      case 'ArrowLeft':
        this.selectLeft();
        break;
      case ' ':
        this.selectAvatar();
        break;
      case 'b':
      case 'B':
        this.back();
        break;
    }
  }

  back() {
    playMusic('back-click', 'SOUND-EFFECT');
    // if (this.config.player1 && this.config.player2 && this.gameTypeSelected) {
    //   this.gameTypeSelected = false;
    //   return;
    // }
    if (this.config.player2) {
      delete this.config.player2;
      return;
    }
    if (this.config.player1) {
      delete this.config.player1;
      return;
    }
    if(this.gameTypeSelected) {
      this.gameTypeSelected = false;
      return;
    }

    this.setupCancelled.emit(true);
  }

  player1SelectLeft() {
    if (this.game.running) {
      return;
    }
    if (this.config.player1 && !this.config.player2) {
      return;
    }
    this.selectLeft();
  }

  player1SelectRight() {
    if (this.game.running) {
      return;
    }
    if (this.config.player1 && !this.config.player2) {
      return;
    }
    this.selectRight();
  }

  player2SelectLeft() {
    if (this.game.running) {
      return;
    }
    if (!this.config.player1) {
      return;
    }
    this.selectLeft();
  }

  player2SelectRight() {
    if (this.game.running) {
      return;
    }
    if (!this.config.player1) {
      return;
    }
    this.selectRight();
  }

  selectLeft() {
    if (!this.gameTypeSelected) {
      const type = this.gameTypes.find(i => i.type === this.config.gameType);
      let index = this.gameTypes.indexOf(type);
      index--;
      if (index < 0) {
        index = this.gameTypes.length - 1;
      }
      delete this.config.gameType;
      setTimeout(() => {
        this.config.gameType = this.gameTypes[index].type;
      });
      return;
    }

    let index = this.playerTypes.indexOf(this.selectedItem);
    if (index > 0) {
      index--;
    }

    delete this.selectedItem;
    setTimeout(() => {
      this.selectedItem = this.playerTypes[index];
      if (this.isPlayerSelected(this.selectedItem)) {
        if (this.playerTypes.indexOf(this.selectedItem) === 0) {
          this.selectRight();
        } else {
          this.selectLeft();
        }
      }
    });
  }

  selectRight() {
    if (!this.gameTypeSelected) {
      const type = this.gameTypes.find(i => i.type === this.config.gameType);
      let index = this.gameTypes.indexOf(type);
      index++;
      if (index >= this.gameTypes.length) {
        index = 0;
      }
      delete this.config.gameType;
      setTimeout(() => {
        this.config.gameType = this.gameTypes[index].type;
      });
      return;
    }

    let index = this.playerTypes.indexOf(this.selectedItem);
    if (index < this.playerTypes.length - 1) {
      index++;
    }

    delete this.selectedItem;
    setTimeout(() => {
      this.selectedItem = this.playerTypes[index];
      if (this.isPlayerSelected(this.selectedItem)) {
        const selectedIndex = this.playerTypes.indexOf(this.selectedItem);
        if (selectedIndex === this.playerTypes.length - 1) {
          this.selectLeft();
        } else {
          this.selectRight();
        }
      }
    });
  }

  selectAvatar() {
    if (!this.gameTypeSelected) {
      this.gameTypeSelected = true;
      playMusic('click', 'SOUND-EFFECT');
    }
    else if (!this.config.player1 && !this.isExternalGame) {
      this.config.player1 = new Player(1);
      this.config.player1.avatar = this.selectedItem;
      playMusic('click', 'SOUND-EFFECT');
      const index = this.playerTypes.indexOf(this.selectedItem);
      if (index < this.playerTypes.length - 1) {
        this.selectRight();
      } else {
        this.selectLeft();
      }
    }
    else if (!this.config.player2 && !this.isExternalGame) {
      if (this.config.player1.avatar.baseUrl === this.selectedItem.baseUrl) {
        return;
      }
      this.config.player2 = new Player(2);
      this.config.player2.avatar = this.selectedItem;
      playMusic('click', 'SOUND-EFFECT');

    } else {
      this.configChange.emit(this.config);
      playMusic('click', 'SOUND-EFFECT');
    }
  }

  get isExternalGame() {
    return this.selectedGameType?.type === 'AZ' || this.selectedGameType?.type === 'UT' || this.selectedGameType?.type === 'NV';
  }

  isPlayerSelected(playerType: PlayerAvatar) {
    if (this.config.player1 && !this.config.player2) {
      return this.config.player1.avatar.baseUrl === playerType.baseUrl;
    }

    return false;
  }
  private _playerTypes: PlayerAvatar[] = [];
  get playerTypes() {
    if (this._playerTypes.length === 0) {
      this._playerTypes = PlayerRepository.getAll();
      const leaders = this.leaderboardRepository.leaderBoard;
      for (const item of this._playerTypes) {
        const leaderboard = leaders.find(i => i.avatar.baseUrl === item.baseUrl);
        if (leaderboard) {
          item.points = leaderboard.total;
          item.totalPlays = leaderboard.wins + leaderboard.loses + leaderboard.ties;
        } else {
          item.points = 0;
        }
      }

      // Sort the players according to popularity
      const sortedPlayerTypes = this._playerTypes.sort((a, b) => a.totalPlays > b.totalPlays ? -1 : 1);
      const altSortPlayerTypes = [];
      let alt = false;
      for (const item of sortedPlayerTypes) {

        if (alt) {
          altSortPlayerTypes.push(item);
        } else {
          altSortPlayerTypes.unshift(item);
        }
        alt = !alt;
      }
      this._playerTypes = altSortPlayerTypes;
    }

    return this._playerTypes;
  }

  get scrollOffset() {
    const index = this.playerTypes.indexOf(this.selectedItem);
    const nonsScrollCount = 2;

    const placesToScroll = index - nonsScrollCount;

    return `translateX(${placesToScroll > -1 ? '-' : ''}${Math.abs(placesToScroll) * 140}px)`;
  }
}
