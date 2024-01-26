import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { getPlayerTypes } from '../../models/game';
import { CommonModule } from '@angular/common';
import { JoystickState, Player } from '../../models/player';
import { GameSetupConfig } from '../../models/game-setup-config';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GameSetupComponent {
  selectedItem: string;

  @Input() config: GameSetupConfig = new GameSetupConfig();
  @Output() configChange: EventEmitter<GameSetupConfig> = new EventEmitter();
  private joystick1 = new JoystickState(0);
  private joystick2 = new JoystickState(1);


  constructor() {
    this.selectedItem = this.playerTypes[11];

    this.joystick1.onLeftJoyStick = this.selectLeft.bind(this);
    this.joystick1.onRightJoyStick = this.selectRight.bind(this);
    this.joystick1.onButtonPress = this.buttonPress.bind(this);

    this.joystick2.onLeftJoyStick = this.selectLeft.bind(this);
    this.joystick2.onRightJoyStick = this.selectRight.bind(this);
    this.joystick2.onButtonPress = this.buttonPress.bind(this);

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
      //this.selectedItem = this.playerTypes[7];


    }
    else if (!this.config.player2) {
      this.config.player2 = new Player(2);
      this.config.player2.avatar = this.selectedItem;
    } else {
      this.configChange.emit(this.config);
    }
  }

  selectRight() {
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
