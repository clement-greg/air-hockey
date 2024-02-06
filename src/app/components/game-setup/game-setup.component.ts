import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { GameSetupConfig } from '../../models/game-setup-config';
import { GameType } from '../../models/game-type';
import { getPlayerTypes } from '../../services/utilities';
import { JoystickState } from '../../services/joystick-state';



@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GameSetupComponent implements OnChanges {
  selectedItem: string;

  @Input() config: GameSetupConfig = new GameSetupConfig();
  @Output() configChange: EventEmitter<GameSetupConfig> = new EventEmitter();
  private joystick1 = new JoystickState(0);
  private joystick2 = new JoystickState(1);
  gameTypeSelected = false;
  gameTypes: GameType[] = [
    { type: 'Virtual', lottieUrl: 'https://lottie.host/2624709a-b10c-43e1-af2a-623d1434c3b3/HhWUwa1d3c.json', description: 'Play pong using the joysticks' },
    { type: 'Physical', lottieUrl: 'https://lottie.host/063f9150-34fc-4bdc-92df-16318a0f3a79/xG6AAyhFbC.json', description: 'Play air hockey on the real table' },
    { type: 'Both', lottieUrl: 'https://lottie.host/a7044b1d-7b7c-4dbe-8c08-f8579798acd4/pnWDVXLTWJ.json', description: 'Play both pong and the real table simultaneously' }
  ];

  constructor() {
    this.selectedItem = this.playerTypes[11];
    this.joystick1.onLeftJoyStick = this.selectLeft.bind(this);
    this.joystick1.onRightJoyStick = this.selectRight.bind(this);
    this.joystick1.onButtonPress = this.buttonPress.bind(this);
    this.joystick2.onLeftJoyStick = this.selectLeft.bind(this);
    this.joystick2.onRightJoyStick = this.selectRight.bind(this);
    this.joystick2.onButtonPress = this.buttonPress.bind(this);
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
    if (this.config.player1 && this.config.player2 && this.gameTypeSelected) {
      this.gameTypeSelected = false;
      return;
    }
    if (this.config.player2) {
      delete this.config.player2;
      return;
    }
    if (this.config.player1) {
      delete this.config.player1;
      return;
    }
  }

  selectLeft() {
    if (this.config.player1 && this.config.player2 && !this.gameTypeSelected) {
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

    this.selectedItem = this.playerTypes[index];
  }

  selectAvatar() {
    if (!this.config.player1) {
      this.config.player1 = new Player(1);
      this.config.player1.avatar = this.selectedItem;
    }
    else if (!this.config.player2) {
      this.config.player2 = new Player(2);
      this.config.player2.avatar = this.selectedItem;
    } else if (!this.gameTypeSelected) {
      this.gameTypeSelected = true;
    } else {
      this.configChange.emit(this.config);
    }
  }

  selectRight() {
    if (this.config.player1 && this.config.player2 && !this.gameTypeSelected) {
      const type = this.gameTypes.find(i => i.type === this.config.gameType);
      let index = this.gameTypes.indexOf(type);
      index++;
      if (index >= this.gameTypes.length) {
        index = 0;
      }
      delete this.config.gameType;
      setTimeout(()=> {
        this.config.gameType = this.gameTypes[index].type;
      });
      return;
    }

    let index = this.playerTypes.indexOf(this.selectedItem);
    if (index < this.playerTypes.length - 1) {
      index++;
    }

    this.selectedItem = this.playerTypes[index];
  }

  private _playerTypes: string[] = [];
  get playerTypes() {
    if (this._playerTypes.length === 0) {
      this._playerTypes = getPlayerTypes();
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
