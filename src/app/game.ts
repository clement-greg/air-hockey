import { GameMessage } from "./game-message";

export class Game {
    startTime: Date;

    player1Score = 0;
    player2Score = 0;

    running = false;

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
                }
                break;
            case 'PLAYER_2_SCORED':
                if (this.running) {
                    this.player2Score++;
                }
                break;

        }
    }

    get endTime(): Date {

        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + this.duration);
        console.log(dt);
        return dt;
    }

    loop() {

    }

    get secondsRemaining() {
        let remaining = this.getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining < 0) {
            remaining = 0;
            this.running = false;
        }

        return remaining;
    }

    private getSecondsBetweenDates(date1: Date, date2: Date): number {
        // Get the difference in milliseconds
        let diffInMilliseconds = date2.getTime() - date1.getTime();

        // Convert milliseconds to seconds and return
        return Math.floor(diffInMilliseconds / 1000);
    }
}