import { PlayerAvatar } from "./player-avatar";

export class LeaderBoard {
    avatar: PlayerAvatar;
    wins: number;
    loses: number;
    ties: number;
    shown = false;

    get total() {
        return (this.wins * 2) + this.ties;
    }
}