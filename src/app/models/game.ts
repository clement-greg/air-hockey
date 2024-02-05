import { getRandomNumber, getSecondsBetweenDates } from "../services/utilities";
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
    gameMenuMusicUrl = '../../assets/music/bg-music.mp3';
    // musicFiles: string[] = [
    //     'bleed-it-out',
    //     'click-click-boom',
    //     'enter-sandman',
    //     'heavy',
    //     'i-stand-alone',
    //     'jump',
    //     'ladies-and-gentlemen',
    //     'natural',
    //     'no-leaf-clover',
    //     'radioactive',
    //     'rocky-mountain-way',
    //     'sail',
    //     'seven-nation-army',
    //     'sound-of-madness',
    //     'viva-la-vida',
    //     'take-on-me',
    //     'rule-the-world',
    //     'how-did-you-love',
    //     'woo-hoo',
    //     'wicked-garden',
    //     'where-the-river-flows',
    //     'teen-spirit',
    //     'sabotage',
    //     'rock-super-star',
    //     'right-round',
    //     'plush',
    //     'machine-head'
    // ];
    // musicBaseUrl = 'https://gbcstorageaccount.blob.core.windows.net/public/music/';

    constructor() {
        this.config.gameType = 'Physical';
        this.setRandomBackgroundMusic();
    }


    restart() {
        this.duration = GameSettings.Instance.gameDuration;

        this.startTime = new Date();
        this.player1Score = 0;
        this.player2Score = 0;
        this.running = true;
        if (window.parent) {
            if(this.config.gameType === 'Virtual') {

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
        if(this.config.gameType === 'Both' || this.config.gameType === 'Virtual') {
            this.playPong = true;
        } else {
            this.playPong = false;
        }
        this.bgMusicElement.pause();
        this.setRandomBackgroundMusic();
        this.bgMusicElement.volume = GameSettings.Instance.musicVolume;
        this.bgMusicElement.currentTime = 0;
        if (GameSettings.Instance.playBackgroundMusic) {
            this.bgMusicElement.play();
        }
    }

    private setRandomBackgroundMusic() {
        if(!this.bgMusicElement) {
            setTimeout(()=> this.setRandomBackgroundMusic(), 100);
            return;
        }
        if(!GameSettings.Instance.gameMusicUrls) {
            GameSettings.Instance.gameMusicUrls = [this.gameMenuMusicUrl];
        }
        const index = getRandomNumber(0, GameSettings.Instance.gameMusicUrls.length - 1);
        this.bgMusicElement.src = GameSettings.Instance.gameMusicUrls[index];
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
            sound.volume = GameSettings.Instance.soundFxVolume;
            if (GameSettings.Instance.playSoundFX) {
                sound.play();
            }
        }
    }

    get endTime(): Date {
        const dt = new Date(this.startTime);

        dt.setSeconds(dt.getSeconds() + this.duration);
        return dt;
    }

    loop() { }


    private fadeInterval: any;
    fadeOutAudio(id: string) {
        const audio: any = document.getElementById(id);

        this.fadeInterval = setInterval(() => {
            if (audio.volume > 0) {
                let volume = audio.volume;
                volume -= 0.01;
                if (volume < 0) {
                    volume = 0;
                }
                audio.volume = volume;
            }
            if (audio.volume <= 0) {
                clearInterval(this.fadeInterval);
            }
        }, 200);
    }

    get bgMusicElement(): HTMLAudioElement {
        return document.getElementById('bg-music') as HTMLAudioElement;
    }

    get secondsRemaining() {
        if (!this.startTime) {
            return '-';
        }
        let remaining = getSecondsBetweenDates(new Date(), this.endTime);
        if (remaining < 0) {
            remaining = 0;
            if (this.running) {
                this.fadeOutAudio('bg-music');
                this.setRandomBackgroundMusic();

                setTimeout(() => {
                    if (GameSettings.Instance.playBackgroundMusic) {
                        this.setRandomBackgroundMusic();
                        this.bgMusicElement.currentTime = 0;
                        this.bgMusicElement.volume = GameSettings.Instance.musicVolume;
                        this.bgMusicElement.play();

                    }
                }, 1000);
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
        const video: any = document.getElementById('bg-video');
        video.play();

        const bgAudio: any = document.getElementById('bg-music');
        bgAudio.currentTime = 0;
        bgAudio.volume = GameSettings.Instance.musicVolume;

        if (GameSettings.Instance.playBackgroundMusic) {
            bgAudio.play();
        }

        this.introMode = false;
    }

    private playWin() {
        const win: any = document.getElementById('win-soundfx');

        win.currentTime = 0;
        win.volume = GameSettings.Instance.soundFxVolume;
        win.loop = false;
        if (GameSettings.Instance.playSoundFX) {
            win.play();
        }
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