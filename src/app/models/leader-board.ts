import { PlayerAvatar } from "./player-avatar";

export class LeaderBoard {
    avatar: PlayerAvatar;
    wins: number;
    loses: number;
    ties: number;

    get total() {
        return (this.wins * 2) + this.ties;
    }
}