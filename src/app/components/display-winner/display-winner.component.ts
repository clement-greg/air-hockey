import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'app-display-winner',
  standalone: true,
  imports: [],
  templateUrl: './display-winner.component.html',
  styleUrl: './display-winner.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisplayWinnerComponent {

  @Input() winner: Player;

}
