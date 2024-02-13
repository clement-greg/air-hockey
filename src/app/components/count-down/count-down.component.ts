import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-count-down',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './count-down.component.html',
  styleUrl: './count-down.component.scss'
})
export class CountDownComponent {

  count = 3;
  showH1 = true;

  constructor() {
    setInterval(() => {
      this.showH1 = false;
      this.count--;
      setTimeout(() => this.showH1 = true);
    }, 1000);
  }

  get display() {
    if (this.count > 0) {
      return this.count;
    }

    return 'Go';
  }

}
