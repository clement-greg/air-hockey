import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GameSettings } from '../../models/settings';
import { PubSubService } from '../../services/pub-sub.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LeaderBoardRepositoryService } from '../../services/leader-board-repository.service';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { SettingsRepositoryService } from '../../services/settings-repository.service';
import { BlobStorageService } from '../../services/blob-storage.service';
import { dataURIToArrayBuffer, resizeImage } from '../../services/utilities';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, MatSelectModule, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSliderModule, MatTabsModule, MatSnackBarModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  settings: GameSettings = SettingsRepositoryService.Instance;
  newMusicUrl: string;

  constructor(private pubSub: PubSubService,
    private snackbar: MatSnackBar,
    private blobStorage: BlobStorageService,
    private leaderboardReposition: LeaderBoardRepositoryService) { }

  swallowKeyUp(keyEvent: KeyboardEvent) {
    keyEvent.stopPropagation();
  }

  addMusicUrl() {
    if (!this.settings.gameMusicUrls) {
      this.settings.gameMusicUrls = [];
    }
    if (this.settings.gameMusicUrls.indexOf(this.newMusicUrl) === -1) {
      this.settings.gameMusicUrls.push(this.newMusicUrl);
    }

    delete this.newMusicUrl;
    this.saveSettings();
  }

  deleteStandings() {
    const items = this.leaderboardReposition.leaderBoard;

    this.leaderboardReposition.clearLeaderboard();

    const ref = this.snackbar.open('Standings Cleared', 'Undo', { duration: 10000 });
    ref.onAction().subscribe(action => {
      this.leaderboardReposition.restoreLeaderboard(items);

      this.snackbar.open('Standings Restored', null, { duration: 3000 });
    });
  }

  removeMusicUrl(url: string) {
    this.settings.gameMusicUrls.splice(this.settings.gameMusicUrls.indexOf(url), 1);
    this.saveSettings();
  }

  savePlayBackgroundMusic(value: boolean) {
    if (!value) {
      (document.getElementById('bg-music') as any).pause();
    } else {
      (document.getElementById('bg-music') as any).play();

    }
    this.saveSettings();
  }

  saveMusicSettings(value: number) {
    (document.getElementById('bg-music') as any).volume = value;

    this.saveSettings();
  }

  saveSoundFXSettings(value: number) {
    const sound: any = document.getElementById('score-1');
    sound.pause();
    sound.currentTime = 0;
    sound.volume = value;
    sound.play();
  }

  handleFiles(files: any) {
    const thisItem = this;
    if (files.srcElement) {
      files = files.srcElement.files;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageType = /^image\//;

      if (!imageType.test(file.type)) {
        continue;
      }
      const reader = new FileReader();

      const setUrl = (url: string | ArrayBuffer) => {
        // this.url = url;
        // this.urlChange.emit(this.url);
      };
      reader.onload = (function () {
        return async (e) => {

          console.log(e.target.result);
          let url = e.target.result;
          url = await resizeImage(url as string, undefined, 200);
          const arrayBuffer = await dataURIToArrayBuffer(url as string);

          await thisItem.blobStorage.uploadFile('some-file.jpg', arrayBuffer);
          setUrl(e.target.result);

        };
      })();

      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    setTimeout(() => {
      SettingsRepositoryService.save();
      this.pubSub.publish({
        type: 'SETTINGS-CHANGED',
        messageBody: this.settings
      });
    });
  }
}
