import { GameSettings } from "../models/settings";

export class SettingsRepositoryService {
    private static instance: GameSettings;
    static get Instance() {
        if (!SettingsRepositoryService.instance) {
            let instance = new GameSettings();
            const json = localStorage.getItem('settings');
            if (json) {
                const storedInstance = JSON.parse(json);
                for (const key in storedInstance) {
                    (instance as any)[key] = storedInstance[key];
                }
            }
            if (!instance.gameDuration || instance.gameDuration < 5) {
                instance.gameDuration = 60;
            }
            if (!instance.musicVolume) {
                instance.musicVolume = 0.5;
            }
            if (!instance.soundFxVolume) {
                instance.soundFxVolume = 0.5;
            }
            if (!instance.puckForce) {
                instance.puckForce = .1;
            }
            if (!instance.puckResetForce) {
                instance.puckResetForce = 3;
            }

            SettingsRepositoryService.instance = instance;
        }

        return SettingsRepositoryService.instance;
    }

    
    static save() {
        const json = JSON.stringify(SettingsRepositoryService.Instance);
        localStorage.setItem('settings', json);
    }
}