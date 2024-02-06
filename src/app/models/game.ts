import { fadeOutAudio, getRandomNumber, getSecondsBetweenDates, pauseMusic, playMusic, playVideo } from "../services/utilities";
import { GameMessage } from "./game-message";
import { GameSetupConfig } from "./game-setup-config";
import { Player } from "./player";
import { GameSettings } from "./settings";

export class Game {
    startTime: Date;
    player1Score = 0;
    player2Score = 0;
    running = false;
    winner: Player;
    config: GameSetupConfig = new GameSetupConfig();
    introMode = true;
    duration = 60;
    gameSetup = false;
    isTie = false;
    settingsVisible = false;
    playPong = false;
    warningPlayed = false;
    gameMenuMusicUrl = '../../assets/music/bg-music.mp3';


    constructor() {
        this.config.gameType = 'Physical';
    }


    restart() {
        this.duration = GameSettings.Instance.gameDuration;

        this.startTime = new Date();
        this.player1Score = 0;
        this.player2Score = 0;
        this.warningPlayed = false;
        this.running = true;
        if (window.parent) {
            if (this.config.gameType === 'Virtual') {
                const msg: GameMessage = {
                    messageType: 'VIRTUAL_GAME_STARTED',
                    sender: 'Client'
                };
                window.parent.postMessage(JSON.stringify(msg), '*');
            } else {
                const msg: GameMessage = {
                    messageType: 'GAME_STARTED',
                    sender: 'Client'
                };
                window.parent.postMessage(JSON.stringify(msg), '*');
            }

        }
        if (this.config.gameType === 'Both' || this.config.gameType === 'Virtual') {
            this.playPong = true;
        } else {
            this.playPong = false;
        }
        pauseMusic('bg-music');

        const src = this.getRandomBackgroundMusicUrl();

        playMusic('bg-music', 'BACKGROUND-MUSIC', src);
    }

    private getRandomBackgroundMusicUrl() {
        if (!GameSettings.Instance.gameMusicUrls) {
            GameSettings.Instance.gameMusicUrls = [this.gameMenuMusicUrl];
        }
        const index = getRandomNumber(0, GameSettings.Instance.gameMusicUrls.length - 1);
        return GameSettings.Instance.gameMusicUrls[index];
    }

    processGameMessage(message: GameMessage) {
        switch (message.messageType) {
            case 'PLAYER_1_SCORED':
                if (this.running) {
                    this.player1Score++;
                    playMusic('score-1', 'SOUND-EFFECT');
                }
                break;
            case 'PLAYER_2_SCORED':
                if (this.running) {
                    this.player2Score++;
                    playMusic('score-1', 'SOUND-EFFECT');
                }
                break;
        }
    }


    get endTime(): Date {
        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + this.duration);
        return dt;
    }

    loop() { }

    get secondsRemaining() {
        if (!this.startTime) {
            return '-';
        }
        let remaining = getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining < 10 && !this.warningPlayed) {
            this.warningPlayed = true;
            playMusic('warning', 'SOUND-EFFECT');
        }
        if (remaining < 0) {
            remaining = 0;
            this.handleEndOfGame();

        }

        return remaining;
    }

    private eogTimeout: any = null;
    async handleEndOfGame() {
        if (!this.running) {
            return;
        }
        await fadeOutAudio('bg-music');

        setTimeout(() => {
            const src = this.getRandomBackgroundMusicUrl();
            playMusic('bg-music', 'BACKGROUND-MUSIC', src);
        }, 1000);
        if (this.player1Score > this.player2Score) {
            this.winner = this.config.player1;
            playMusic('win-soundfx', 'SOUND-EFFECT');
        }
        if (this.player2Score > this.player1Score) {
            this.winner = this.config.player2;
            playMusic('win-soundfx', 'SOUND-EFFECT');
        }
        else if (this.player1Score === this.player2Score) {
            this.isTie = true;
            this.running = false;
        }

        this.running = false;
        if (window.parent) {
            const msg: GameMessage = {
                messageType: 'GAME_OVER',
                sender: 'Client'
            };
            window.parent.postMessage(JSON.stringify(msg), '*');
        }
        this.playPong = false;

        // Wait 30 seconds and then show the intro screen
        this.eogTimeout = setTimeout(() => {
            delete this.winner;
            this.isTie = false;
            this.introMode = true;
        }, 30000);
    }

    handleSpace() {
        if (this.winner || this.introMode || this.isTie) {
            delete this.winner;
            this.startGame();
        }
    }

    startGame() {
        this.isTie = false;
        clearTimeout(this.eogTimeout);
        const lastType = this.config.gameType;
        const defaultPlayer1 = this.config?.player1;
        const defaultPlayer2 = this.config?.player2;

        delete this.winner;
        this.config = new GameSetupConfig();
        this.config.player1 = defaultPlayer1;
        this.config.player2 = defaultPlayer2;
        this.config.gameType = lastType;
        this.gameSetup = true;
        playVideo('bg-video');


        const src = this.getRandomBackgroundMusicUrl();
        playMusic('bg-music', 'BACKGROUND-MUSIC', src);

        this.introMode = false;
    }
}