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
    gameSetup = false;
    isTie = false;
    settingsVisible = false;
    playPong = false;
    musicFiles:string[] = [
        'bleed-it-out',
        'click-click-boom',
        'enter-sandman',
        'heavy',
        'i-stand-alone',
        'jump',
        'ladies-and-gentlemen',
        'natural',
        'no-leaf-clover',
        'radioactive',
        'rocky-mountain-way',
        'sail',
        'seven-nation-army',
        'sound-of-madness',
        'viva-la-vida',
        'take-on-me',
        'rule-the-world',
        'how-did-you-love',
        'woo-hoo',
        'wicked-garden',
        'where-the-river-flows',
        'teen-spirit',
        'sabotage',
        'rock-super-star',
        'right-round',
        'plush',
        'machine-head'
    ];
    musicBaseUrl = 'https://gbcstorageaccount.blob.core.windows.net/public/music/';

    constructor(private duration: number) {

    }


    restart() {
        this.startTime = new Date();
        this.player1Score = 0;
        this.player2Score = 0;
        this.running = true;
        if (window.parent) {
            const msg: GameMessage = {
                messageType: 'GAME_STARTED',
                sender: 'Client'
            };
            window.parent.postMessage(JSON.stringify(msg), '*');
        }
        const bgAudio: any = document.getElementById('bg-music');
        bgAudio.pause();
        const gameAudio: any = document.getElementById('arcade-funk');
        const index = this.getRandomNumber(0,this.musicFiles.length - 1);
        gameAudio.src = `${this.musicBaseUrl}${this.musicFiles[index]}.mp3`;
        gameAudio.volume = .05;
        gameAudio.currentTime = 0;
        gameAudio.play();
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
        if (GameSettings.Instance.playSoundFX) {
            const sound: any = document.getElementById('score-1');
            sound.pause();
            sound.currentTime = 0;
            sound.volume = .1;
            sound.play();
        }
    }

    get endTime(): Date {

        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + this.duration);
        return dt;
    }

    loop() {

    }


    private fadeInterval:any;
    fadeOutAudio(id: string) {
        const audio:any = document.getElementById(id);

        this.fadeInterval = setInterval(()=> {
            if(audio.volume > 0) {
                let volume = audio.volume;
                volume -= 0.01;
                if(volume < 0) {
                    volume = 0;
                }
                audio.volume = volume;
            }
            if(audio.volume <= 0) {
                clearInterval(this.fadeInterval);
            }
        }, 200);
    }

    get secondsRemaining() {
        if (!this.startTime) {
            return '-';
        }
        let remaining = this.getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining < 0) {
            remaining = 0;
            if (this.running) {
                // const gameAudio: any = document.getElementById('arcade-funk');
                // gameAudio.pause();
                this.fadeOutAudio('arcade-funk');
                if (this.player1Score > this.player2Score) {
                    this.winner = this.config.player1;
                    this.playWin();
                }
                if (this.player2Score > this.player1Score) {
                    this.winner = this.config.player2;
                    this.playWin();
                }
                else if (this.player1Score === this.player2Score) {
                    this.isTie = true;
                    this.running = false;
                }
                this.handleEndOfGame();
            }
        }

        return remaining;
    }

    private eogTimeout: any = null;
    handleEndOfGame() {

        this.running = false;
        if (window.parent) {
            const msg: GameMessage = {
                messageType: 'GAME_OVER',
                sender: 'Client'
            };
            window.parent.postMessage(JSON.stringify(msg), '*');
        }
        this.playPong = false;
        this.eogTimeout = setTimeout(() => {
            delete this.winner;
            this.isTie = false;
            this.introMode = true;
        }, 30000);
    }

    handleSpace() {
        // if(this.running || this.gameSetup) {
        //     return;
        // }
        if (this.winner || this.introMode || this.isTie) {
            delete this.winner;
            this.startGame();
        }
    }

    startGame() {
        this.isTie = false;
        clearTimeout(this.eogTimeout);
        const defaultPlayer1 = this.config?.player1;
        const defaultPlayer2 = this.config?.player2;

        delete this.winner;
        this.config = new GameSetupConfig();
        this.config.player1 = defaultPlayer1;
        this.config.player2 = defaultPlayer2;


        this.gameSetup = true;
        const video: any = document.getElementById('bg-video');
        video.play();

        const bgAudio: any = document.getElementById('bg-music');
        bgAudio.currentTime = 0;
        bgAudio.volume = .05;

        if (GameSettings.Instance.playBackgroundMusic) {
            bgAudio.play();
        }

        const gameAudio: any = document.getElementById('arcade-funk');
        gameAudio.pause();
        this.introMode = false;
    }

    private playWin() {

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

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
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
        'hockey-player',
        'monster-1',
        'tank',
        'monster-truck',
        'fairy',
        'snake',
        'ape',
        'monster-2',
        'moose',
        'eagle',
        'rabbit',
        'witch',
        'tiger',
        'troll',
        'construction-worker',
        'unicorn',
        'werewolf',
        'wizard',
    ];
}