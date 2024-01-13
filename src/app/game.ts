import { GameMessage } from "./game-message";

export class Game {
    startTime: Date;

    player1Score = 0;
    player2Score = 0;

    running = false;

    player1: Player;
    player2: Player;
    winner: Player;

    constructor(private duration: number) {

    }


    restart() {
        this.startTime = new Date();
        this.player1Score = 0;
        this.player2Score = 0;
        this.running = true;
    }
    processGameMessage(message: GameMessage) {
        switch (message.messageType) {
            case 'PLAYER_1_SCORED':
                if (this.running) {
                    this.player1Score++;
                    this.playScoreSound();
                }
                break;
            case 'PLAYER_2_SCORED':
                if (this.running) {
                    this.player2Score++;
                    this.playScoreSound();
                }
                break;

        }
    }

    private playScoreSound() {
        const sound: any = document.getElementById('score-1');
        sound.pause();
        sound.currentTime = 0;
        sound.volume = .1;
        sound.play();
    }

    get endTime(): Date {

        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + this.duration);
        return dt;
    }

    loop() {

    }

    get secondsRemaining() {
        if (!this.startTime) {
            return '-';
        }
        let remaining = this.getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining < 0) {
            remaining = 0;
            if (this.running) {
                if (this.player1Score > this.player2Score) {
                    this.winner = this.player1;
                    this.playWin();
                }
                if (this.player2Score > this.player1Score) {
                    this.winner = this.player2;
                    this.playWin();
                }
            }
            this.running = false;
        }

        return remaining;
    }

    private playWin() {
        const gameAudio: any = document.getElementById('arcade-funk');
        gameAudio.pause();
        const win: any = document.getElementById('win-soundfx');

        win.currentTime = 0;
        win.volume = .1;
        win.loop = false;
        win.play();
    }

    private getSecondsBetweenDates(date1: Date, date2: Date): number {
        let diffInMilliseconds = date2.getTime() - date1.getTime();
        return Math.floor(diffInMilliseconds / 1000);
    }
}

export class Player {
    avatar: string;

    constructor(playerNumber: number) { }
}

export class GameSetupConfig {
    player1: Player;
    player2: Player;
}

export function getPlayerTypes() {
    return [
        'mouse',
        'bear',
        'cat',
        'chicken',
        'dog',
        'dragon',
        'duck',
        'knight',
        'llama',
        'lion',
        'monkey',
        'monster-1',
        'monster-2',
        'tank',
        'monster-truck',
        'snake',
        'ape',
        'moose',
        'eagle',
        'rabbit',
        'tiger',
        'troll',
        'unicorn',
        'werewolf',
        'wizard',
    ];
}

// export enum PlayerType {

// }