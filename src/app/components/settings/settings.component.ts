import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GameSettings } from '../../models/settings';
import { PubSubService } from '../../services/pub-sub.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSliderModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent  {

  settings: GameSettings = GameSettings.Instance;

  constructor(private pubSub: PubSubService) {

    
  }

  
  savePlayBackgroundMusic(value: boolean) {

    if(!value) {
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

  saveSettings() {
    setTimeout(()=> {
      this.settings.save();
      this.pubSub.publish({
        type: 'SETTINGS-CHANGED',
        messageBody: this.settings
      });

    });
  }
}
