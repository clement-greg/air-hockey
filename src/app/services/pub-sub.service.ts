import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PubSubService {

  private subscriptionSource = new Subject<PubSubMessage>();
  subscription = this.subscriptionSource.asObservable();
  
  constructor() { }


  //Publishes a message to any current subscribers
  publish(message: PubSubMessage) {
    this.subscriptionSource.next(message);
  }
}

export class PubSubMessage {
  type: 'SETTINGS-CHANGED' | 'PLAYER_1_SCORED' | 'PLAYER_2_SCORED';
  messageBody: any;
}
