import { PlayerAvatar } from "../models/player-avatar";

export class PlayerRepository {

    static getAll(): PlayerAvatar[] {
        const items = [
            { baseUrl: 'mouse', name: 'Merton Cheezmuncher' },
            { baseUrl: 'chicken', name: 'KFC' },
            { baseUrl: 'dog', name: 'Kojack' },
            { baseUrl: 'dragon', name: 'Adorable Rage' },
            { baseUrl: 'duck', name: 'Milton Mallard' },
            { baseUrl: 'knight', name: 'Palace Guard' },
            { baseUrl: 'llama', name: 'Sal-paca' },
            { baseUrl: 'monkey', name: 'Banana Muncher' },
            { baseUrl: 'hockey-player', name: 'Puck Face' },
            { baseUrl: 'monster-1', name: 'Bird Ball' },
            { baseUrl: 'tank', name: 'Rolling Destruction' },
            { baseUrl: 'monster-truck', name: 'Also Rolling Destruction' },
            { baseUrl: 'fairy', name: 'Princess Flutter' },
            { baseUrl: 'ape', name: 'Ceasar' },
            { baseUrl: 'monster-2', name: 'Grog' },
            { baseUrl: 'moose', name: 'Wally' },
            { baseUrl: 'eagle', name: 'Merica' },
            { baseUrl: 'rabbit', name: '4x Lucky' },
            { baseUrl: 'witch', name: 'Witchy Woman' },
            { baseUrl: 'tiger', name: 'Stripe' },
            { baseUrl: 'construction-worker', name: 'Bill The Builder' },
            { baseUrl: 'wizard', name: 'Gildorf' },
            { baseUrl: 'baseball-squirrel', name: 'The Natural' },
            { baseUrl: 'wiz1', name: 'The Wiz' },
            { baseUrl: 'scare-bear', name: 'Scare Bear' },
            { baseUrl: 'honest-ape', name: 'Honest Ape' }
        ];


        return items;
    }
}