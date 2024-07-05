// Simple Anguler service for CRUD operations storing leaderboard information
// All information is stored in localStorage

import { Injectable } from '@angular/core';
import { LeaderBoard } from '../models/leader-board';
import { copyObject } from './utilities';
import { PlayerAvatar } from '../models/player-avatar';
import { GameResult } from '../models/game-result';
import { PlayerRepository } from './player-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardRepositoryService {

  private leaderboardItems: LeaderBoard[];
  private storageKey = 'leader-board';

  constructor() { }

  // returns an array of leaderBoard items
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
      for (const avatar of PlayerRepository.getAll()) {
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

  //saves the current list of leaderBoard items
  save() {
    const json = JSON.stringify(this.leaderBoard);

    localStorage.setItem(this.storageKey, json);
  }

  //clears the leaderBoard items and leaves a new list
  clearLeaderboard() {
    delete this.leaderboardItems;
    localStorage.removeItem(this.storageKey);
  }

  //Restores previously cleared leaderBoard items
  restoreLeaderboard(leaderBoard: LeaderBoard[]) {
    this.leaderboardItems = leaderBoard;
    this.save();
  }

  //Records the result of a game to the leaderBoard
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

