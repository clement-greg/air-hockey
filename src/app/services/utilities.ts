import { GameSettings } from "../models/settings";

export function getSecondsBetweenDates(date1: Date, date2: Date): number {
    let diffInMilliseconds = date2.getTime() - date1.getTime();
    return Math.floor(diffInMilliseconds / 1000);
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function playVideo(elementId: string) {
    const videoElement = document.getElementById(elementId) as HTMLVideoElement;
    videoElement.play();

}

export function playMusic(elementId: string, type: 'BACKGROUND-MUSIC' | 'SOUND-EFFECT', src: string = null) {
    const audioElement = document.getElementById(elementId) as HTMLAudioElement;

    audioElement.currentTime = 0;

    if (src) {
        audioElement.src = src;
    }
    if (type === 'BACKGROUND-MUSIC' && GameSettings.Instance.playBackgroundMusic) {
        audioElement.volume = GameSettings.Instance.musicVolume;
        audioElement.play();
    }

    if (type === 'SOUND-EFFECT' && GameSettings.Instance.playSoundFX) {
        audioElement.volume = GameSettings.Instance.soundFxVolume;
        audioElement.play();
    }
}

export function fadeOutAudio(id: string) {
    return new Promise((resolve, reject) => {
        const audio: any = document.getElementById(id);

        const fadeInterval = setInterval(() => {
            if (audio.volume > 0) {
                let volume = audio.volume;
                volume -= 0.01;
                if (volume < 0) {
                    volume = 0;
                }
                audio.volume = volume;
            }
            if (audio.volume <= 0) {
                clearInterval(fadeInterval);
                resolve(true);
            }
        }, 200);
    });

}


export function copyObject(source: any, typeCreator: () => any = null) {

    let destination: any;
    if (typeCreator) {
        destination = typeCreator();
    } else {
        destination = {};
    }

    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            try {
                destination[property] = source[property];
            } catch (e) { }
        }
    }

    return destination;
}

export function pauseMusic(elementId: string) {
    const audioElement = document.getElementById(elementId) as HTMLAudioElement;
    audioElement.pause();
}

// export function getPlayerTypes() {
//     return [
//         'mouse',
//         'bear',
//         'cat',
//         'chicken',
//         'dog',
//         'dragon',
//         'duck',
//         'knight',
//         'llama',
//         'lion',
//         'monkey',
//         'hockey-player',
//         'monster-1',
//         'tank',
//         'monster-truck',
//         'fairy',
//         'snake',
//         'ape',
//         'monster-2',
//         'moose',
//         'eagle',
//         'rabbit',
//         'witch',
//         'tiger',
//         'troll',
//         'construction-worker',
//         'unicorn',
//         'werewolf',
//         'wizard',
//     ];
// }