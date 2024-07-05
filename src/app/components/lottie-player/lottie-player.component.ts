import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

@Component({
  selector: 'app-lottie-player',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lottie-player.component.html',
  styleUrl: './lottie-player.component.scss'
})
export class LottiePlayerComponent {

  @Input() height: string = 'unset';
  @Input() src: string;
  @Input() speed: number = 1;
  @Input() loop: boolean = true;
  @Input() autoPlay: boolean = true;
  @Input() intermission: number = 0;

  
}
