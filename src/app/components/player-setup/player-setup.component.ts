import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerAvatar } from '../../models/player-avatar';
import { dataURIToArrayBuffer, newid, resizeImage } from '../../services/utilities';
import { BlobStorageService } from '../../services/blob-storage.service';

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './player-setup.component.html',
  styleUrl: './player-setup.component.scss'
})
export class PlayerSetupComponent implements OnInit {

  newPlayer: PlayerAvatar = new PlayerAvatar();
  players: PlayerAvatar[] = [];
  adding = false;

  constructor(private blobStorage: BlobStorageService,
    private zone: NgZone
  ) {
    this.resetPlayer();
  }

  async ngOnInit() {

    this.players = await this.blobStorage.getPlayers();
    console.log(this.players);
  }


  findImage() {
    document.getElementById('my-file-upload').click();
  }

  resetPlayer() {
    this.newPlayer = new PlayerAvatar();
    this.newPlayer.id = newid();
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
      reader.onload = (() => {
        return async (e) => {
          thisItem.zone.run(async () => {
            let url = e.target.result;
            url = await resizeImage(url as string, undefined, 200);
            this.newPlayer.dataUrl = url;
          });

        };
      })();

      reader.readAsDataURL(file);
    }
  }

  get canSave() {
    return this.newPlayer &&
      this.newPlayer.dataUrl
      && this.newPlayer.name
      && this.newPlayer.description
      && !this.adding;
  }

  removePlayer(player: PlayerAvatar) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  saving = false;
  async save() {
    this.saving = true;
    await this.blobStorage.savePlayers(this.players);
    this.saving = false;
  }


  async add() {
    this.adding = true;
    const dataUrl = this.newPlayer.dataUrl;
    const array = await dataURIToArrayBuffer(dataUrl);
    console.log(this.newPlayer.dataUrl);
    console.log(array);
    await this.blobStorage.uploadFile(`player-avatars/${this.newPlayer.id}.jpg`, array);
    this.players.push(this.newPlayer);
    this.adding = false;
    this.newPlayer.baseUrl = `https://gbcstorageaccount.blob.core.windows.net/air-hockey/player-avatars/${this.newPlayer.id}.jpg`;

    delete this.newPlayer.dataUrl;
    this.resetPlayer();
  }
}
