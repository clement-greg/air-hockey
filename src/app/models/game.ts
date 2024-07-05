import { LeaderBoardRepositoryService } from "../services/leader-board-repository.service";
import { SettingsRepositoryService } from "../services/settings-repository.service";
import { getRandomNumber, getSecondsBetweenDates, playMusic, playVideo, switchMusic } from "../services/utilities";
import { GameMessage } from "./game-message";
import { GameResult } from "./game-result";
import { GameSetupConfig } from "./game-setup-config";

export class Game {
    startTime: Date;
    player1Score = 0;
    player2Score = 0;
    running = false;
    config: GameSetupConfig = new GameSetupConfig();
    introMode = true;
    countdown = false;
    gameSetup = false;
    settingsVisible = false;
    showLeaderboard = false;
    playPong = false;
    warningPlayed = false;
    gameResult: GameResult;
    gameMenuMusicUrl = '../../assets/music/bg-music.mp3';

    showPlayerOneScore = false;
    showPlayerTwoScore = false;


    constructor(private leaderboard: LeaderBoardRepositoryService) {
        this.config.gameType = 'Physical';
    }

    // show the countdown screen for 4s
    private doCountdown() {
        return new Promise((resolve, reject) => {
            this.countdown = true;
            setTimeout(() => {
                this.countdown = false;
                resolve(true);
            }, 4000);
        });
    }

    async restart() {

        this.player1Score = 0;
        this.player2Score = 0;
        playMusic('bg-music', 'BACKGROUND-MUSIC', this.getRandomBackgroundMusicUrl());
        await this.doCountdown();
        this.startTime = new Date();
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
    }



    private getRandomBackgroundMusicUrl() {
        if (!SettingsRepositoryService.Instance.gameMusicUrls) {
            SettingsRepositoryService.Instance.gameMusicUrls = [this.gameMenuMusicUrl];
        }
        const urls = [...SettingsRepositoryService.Instance.gameMusicUrls];
        if (SettingsRepositoryService.Instance.gameDoneMusic) {
            urls.splice(urls.indexOf(SettingsRepositoryService.Instance.gameDoneMusic));
        }
        if (SettingsRepositoryService.Instance.introScreenMusic) {
            urls.splice(urls.indexOf(SettingsRepositoryService.Instance.introScreenMusic));
        }
        const index = getRandomNumber(0, urls.length - 1);
        return SettingsRepositoryService.Instance.gameMusicUrls[index];
    }

    processGameMessage(message: GameMessage) {
        switch (message.messageType) {
            case 'PLAYER_1_SCORED':
                if (this.running) {
                    this.player1Score++;
                    playMusic('score-1', 'SOUND-EFFECT');
                    this.showPlayerOneScore = true;
                    setTimeout(() => this.showPlayerOneScore = false, 1000);
                }
                break;
            case 'PLAYER_2_SCORED':
                if (this.running) {
                    this.player2Score++;
                    playMusic('score-1', 'SOUND-EFFECT');
                    this.showPlayerTwoScore = true;
                    setTimeout(() => this.showPlayerTwoScore = false, 1000);
                }
                break;
        }
    }


    get endTime(): Date {
        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + SettingsRepositoryService.Instance.gameDuration);
        return dt;
    }

    loop() {
        // Intentionally blank
    }

    get secondsRemaining() {
        if (!this.startTime) {
            return '-';
        }
        let remaining = getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining <= 10 && !this.warningPlayed) {
            this.warningPlayed = true;
            playMusic('warning', 'SOUND-EFFECT');
        }
        if (remaining < 0) {
            remaining = 0;

        }
        if (remaining === 0) {
            this.handleEndOfGame();
            return '-';
        }

        return remaining;
    }

    private eogTimeout: any = null;
    async handleEndOfGame() {
        if (!this.running) {
            return;
        }

        const gameResult: GameResult = {
            player1: this.config.player1.avatar,
            player2: this.config.player2.avatar,
            player1Score: this.player1Score,
            player2Score: this.player2Score
        };

        if (this.running) {
            this.leaderboard.recordGameResult(gameResult);
            switchMusic(SettingsRepositoryService.Instance.gameDoneMusic ? SettingsRepositoryService.Instance.gameDoneMusic : this.getRandomBackgroundMusicUrl());
            this.gameResult = gameResult;

            if (this.player1Score > this.player2Score) {
                playMusic('win-soundfx', 'SOUND-EFFECT');

            }
            if (this.player2Score > this.player1Score) {
                playMusic('win-soundfx', 'SOUND-EFFECT');
            }
            else if (this.player1Score === this.player2Score) {
                playMusic('tie-game', 'SOUND-EFFECT');
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

            // Wait 60 seconds and then show the intro screen
            clearTimeout(this.eogTimeout);
            this.eogTimeout = setTimeout(() => {
                delete this.gameResult
                this.introMode = true;
            }, 60000);
        }
    }

    handleSpace() {
        this.showLeaderboard = false;
        if (this.gameResult || this.introMode) {
            delete this.gameResult;
            this.startGame();
        }
    }

    startGame() {
        clearTimeout(this.eogTimeout);
        const lastType = this.config.gameType;
        const defaultPlayer1 = this.config?.player1;
        const defaultPlayer2 = this.config?.player2;

        delete this.gameResult;
        this.config = new GameSetupConfig();
        this.config.player1 = defaultPlayer1;
        this.config.player2 = defaultPlayer2;
        this.config.gameType = lastType;
        this.gameSetup = true;
        playVideo('bg-video');
        const src = SettingsRepositoryService.Instance.introScreenMusic ? SettingsRepositoryService.Instance.introScreenMusic : this.getRandomBackgroundMusicUrl();
        playMusic('bg-music', 'BACKGROUND-MUSIC', src);
        playMusic('click', 'SOUND-EFFECT');
        this.introMode = false;
    }
}