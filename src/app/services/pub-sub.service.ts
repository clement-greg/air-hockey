import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PubSubService {

  private subscriptionSource = new Subject<PubSubMessage>();
  subscription = this.subscriptionSource.asObservable();
  constructor() { }


    publish(message: PubSubMessage) {
        this.subscriptionSource.next(message);
    }
}

export class PubSubMessage {
  type: 'SETTINGS-CHANGED';
  messageBody: any;
}
