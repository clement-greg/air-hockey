import { Injectable } from '@angular/core';
import { LeaderBoard } from '../models/leader-board';
import { copyObject } from './utilities';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardRepositoryService {

  constructor() { }

  getLeaderBoard(): LeaderBoard[] {

    let results: LeaderBoard[];
    if (localStorage.getItem('leader-board')) {
      try {
        results = JSON.parse(localStorage.getItem('leader-board'));
        for (let i = 0; i < results.length; i++) {
          results[i] = copyObject(results[i], () => new LeaderBoard());
        }
      } catch { }
    }

    return results;
  }
}
