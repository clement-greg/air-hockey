import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GameSettings } from '../../models/settings';
import { PubSubService } from '../../services/pub-sub.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent  {

  settings: GameSettings = GameSettings.Instance;

  constructor(private pubSub: PubSubService) {

    
  }



  saveSettings() {
    this.settings.save();
    this.pubSub.publish({
      type: 'SETTINGS-CHANGED',
      messageBody: this.settings
    });
  }
}
