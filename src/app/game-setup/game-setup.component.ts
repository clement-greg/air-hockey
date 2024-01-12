import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GameSetupConfig, Player, getPlayerTypes } from '../game';
import { CommonModule } from '@angular/common';

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


  constructor() {
    this.selectedItem = this.playerTypes[0];
  }

  @HostListener('document:keyup', ['$event'])
  keyPress(evt: KeyboardEvent) {
    console.log(evt);

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
      this.selectedItem = this.playerTypes[0];

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
    const nonsScrollCount = 3;
    if (index < nonsScrollCount) {
      return '';
    }

    const placesToScroll = index - nonsScrollCount;

    //console.log(`translateX(-${placesToScroll * 80})px`)
    return `translateX(-${placesToScroll * 140}px)`;

  }
}
