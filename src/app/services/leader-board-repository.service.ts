import { Injectable } from '@angular/core';
import { LeaderBoard } from '../models/leader-board';
import { copyObject } from './utilities';
import { PlayerAvatar } from '../models/player-avatar';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardRepositoryService {

  private leaderboardItems: LeaderBoard[];
  private storageKey = 'leader-board';
  constructor() { }

  get leaderBoard(): LeaderBoard[] {

    if (!this.leaderboardItems) {
      let results: LeaderBoard[];
      if (localStorage.getItem(this.storageKey)) {
        try {
          results = JSON.parse(localStorage.getItem(this.storageKey));
          for (let i = 0; i < results.length; i++) {
            results[i] = copyObject(results[i], () => new LeaderBoard());
          }
        } catch { }
      }
      if(!results) {
        results = [];
      }
      for (const avatar of PlayerAvatar.getAll()) {
        let leaderBoardItem = results.find(i => i.avatar.baseUrl === avatar.baseUrl);
        if (!leaderBoardItem) {
          leaderBoardItem = new LeaderBoard();
          leaderBoardItem.avatar = avatar;
          leaderBoardItem.loses = 0;
          leaderBoardItem.ties = 0;
          leaderBoardItem.wins = 0;

          results.push(leaderBoardItem);
        }
      }

      for(const item of results) {
        item.shown = false;
      }

      this.leaderboardItems = results;
    }

    this.leaderboardItems = this.leaderboardItems.sort((a, b) => {
      if (a.total != b.total) {
        return a.total > b.total ? -1 : 1
      }

      return a.avatar.name > b.avatar.name ? 1 : -1;
    });
    return this.leaderboardItems;
  }

  save() {
    const json = JSON.stringify(this.leaderBoard);

    localStorage.setItem(this.storageKey, json);
  }

  clearLeaderboard() {
    delete this.leaderboardItems;
    localStorage.removeItem(this.storageKey);
  }

  restoreLeaderboard(leaderBoard: LeaderBoard[]) {
    this.leaderboardItems = leaderBoard;
    this.save();
  }

  recordGameResult(result: GameResult) {
    let items = this.leaderBoard;
    const player1 = items.find(i => i.avatar.baseUrl === result.player1.baseUrl);
    const player2 = items.find(i => i.avatar.baseUrl === result.player2.baseUrl);
    if (result.player1Score > result.player2Score) {
      player1.wins++;
      player2.loses++;
    } else if (result.player2Score > result.player1Score) {
      player1.loses++;
      player2.wins++;
    } else {
      player1.ties++;
      player2.ties++;
    }
    items = items.sort((a, b) => {
      if (a.total != b.total) {
        return a.total > b.total ? -1 : 1
      }

      return a.avatar.name > b.avatar.name ? 1 : -1;
    });
    this.leaderboardItems = items;
    this.save();
  }
}

export class GameResult {
  player1: PlayerAvatar;
  player2: PlayerAvatar;

  player1Score: number;
  player2Score: number;
}
