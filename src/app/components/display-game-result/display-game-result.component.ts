import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameResult, LeaderBoardRepositoryService } from '../../services/leader-board-repository.service';
import { LeaderBoard } from '../../models/leader-board';


@Component({
  selector: 'app-display-game-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-game-result.component.html',
  styleUrl: './display-game-result.component.scss'
})
export class DisplayGameResultComponent {

  @Input() result: GameResult;

  leaderBoard: LeaderBoard[];
  leaderBoardShown: LeaderBoard[] = [];
  constructor(leaderboardRepository: LeaderBoardRepositoryService) {

    this.leaderBoard = leaderboardRepository.leaderBoard;
    for(const item of this.leaderBoard) {
      item.shown = false;
    }
    setTimeout(()=> this.showLeaderboardItem(), 2000);
  }

  get winner() {
    if (this.result.player1Score > this.result.player2Score) {
      return this.result.player1;
    }
    if (this.result.player2Score > this.result.player1Score) {
      return this.result.player2;
    }

    return null;
  }

  get isTie() {
    return this.result.player1Score === this.result.player2Score;
  }

  private showLeaderboardItem() {
    const firstItem = this.leaderBoard.find(i => !i.shown);
    if (firstItem && this.leaderBoardShown.length < 10) {
      firstItem.shown = true;
      this.leaderBoardShown.push(firstItem);

      setTimeout(() => this.showLeaderboardItem(), 500);
    }
  }
}
