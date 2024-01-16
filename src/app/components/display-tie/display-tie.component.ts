import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-display-tie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-tie.component.html',
  styleUrl: './display-tie.component.scss'
})
export class DisplayTieComponent {

  @Input() game: Game;
}
