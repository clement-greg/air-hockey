import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BlobStorageService } from './services/blob-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'air-hockey';
  constructor(private blobStorage: BlobStorageService) {
    // blobStorage.testListBlobs().then(s=> {
    //   console.log(s);
    // });
  }
}
