import { Component } from '@angular/core';
import { LeaderBoardRepositoryService } from '../../services/leader-board-repository.service';
import { LeaderBoard } from '../../models/leader-board';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leader-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader-board.component.html',
  styleUrl: './leader-board.component.scss'
})
export class LeaderBoardComponent {
  leaderBoard: LeaderBoard[];
  leaderBoardShown: LeaderBoard[] = [];

  constructor(leaderboardRepository: LeaderBoardRepositoryService) {

    this.leaderBoard = leaderboardRepository.leaderBoard;
    for (const item of this.leaderBoard) {
      item.shown = false;
    }
    setTimeout(() => this.showLeaderboardItem(), 200);
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
