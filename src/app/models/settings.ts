export class GameSettings {
    playBackgroundMusic: boolean = true;
    playSoundFX: boolean = true;
    gameDuration: number;
    musicVolume: number;
    soundFxVolume: number;
    puckForce: number;
    puckResetForce: number;
    gameMusicUrls:string[];
    introScreenMusic: string;
    gameDoneMusic: string;


    save() {
        const json = JSON.stringify(this);
        localStorage.setItem('settings', json);
    }

    private static instance: GameSettings;
    static get Instance() {
        if(!GameSettings.instance) {
            let instance = new GameSettings();
            const json = localStorage.getItem('settings');
            if(json) {
                const storedInstance = JSON.parse(json);
                for(const key in storedInstance) {
                    (instance as any)[key] = storedInstance[key];
                }
            }
            if(!instance.gameDuration || instance.gameDuration < 5) {
                instance.gameDuration = 60;
            }
            if(!instance.musicVolume ) {
                instance.musicVolume = 0.5;
            }
            if(!instance.soundFxVolume) {
                instance.soundFxVolume = 0.5;
            }
            if(!instance.puckForce) {
                instance.puckForce = .1;
            }
            if(!instance.puckResetForce) {
                instance.puckResetForce = 3;
            }

            GameSettings.instance = instance;
        }

        return GameSettings.instance;
    }
}