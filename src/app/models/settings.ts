export class GameSettings {
    playBackgroundMusic: boolean = true;
    playSoundFX: boolean = true;


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

            GameSettings.instance = instance;
        }

        return GameSettings.instance;
    }
}