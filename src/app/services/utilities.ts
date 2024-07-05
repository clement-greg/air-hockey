// Utilities.ts
// General purpose utility functions

import { GameSettings } from "../models/settings";
import { SettingsRepositoryService } from "./settings-repository.service";


//Returns the number of seconds between two dates
export function getSecondsBetweenDates(date1: Date, date2: Date): number {
    let diffInMilliseconds = date2.getTime() - date1.getTime();
    return Math.floor(diffInMilliseconds / 1000);
}

//Returns a random number
export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Starts playing video for the specified HTMLVideoElement
export function playVideo(elementId: string) {
    const videoElement = document.getElementById(elementId) as HTMLVideoElement;
    videoElement.play();
}

//Starts playing music when appropriate for the given HTMLAudioElement
export function playMusic(elementId: string, type: 'BACKGROUND-MUSIC' | 'SOUND-EFFECT', src: string = null) {
    const audioElement = document.getElementById(elementId) as HTMLAudioElement;

    audioElement.currentTime = 0;

    if (src) {
        audioElement.src = src;
    }
    if (type === 'BACKGROUND-MUSIC' && SettingsRepositoryService.Instance.playBackgroundMusic) {
        audioElement.volume = SettingsRepositoryService.Instance.musicVolume;
        audioElement.play();
    }

    if (type === 'SOUND-EFFECT' && SettingsRepositoryService.Instance.playSoundFX) {
        audioElement.volume = SettingsRepositoryService.Instance.soundFxVolume;
        audioElement.play();
    }
}

//Fades out the audio until it is silent
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
        }, 50);
    });

}

//Fades out the playing audio and starts a new music track
export async function switchMusic(newSrc: string) {
    await fadeOutAudio('bg-music');
    playMusic('bg-music', 'BACKGROUND-MUSIC', newSrc);
}


//Creates a strongly typed shallow copy of an existing object.  
export function copyObject(source: any, typeCreator: () => any) {

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

//Pauses an HTMLAudioElement
export function pauseMusic(elementId: string) {
    const audioElement = document.getElementById(elementId) as HTMLAudioElement;
    audioElement.pause();
}