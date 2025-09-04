import { PlayerAvatar } from "../models/player-avatar";

export class PlayerRepository {

    static getAll(): PlayerAvatar[] {
        const items = [
            { baseUrl: 'mouse', name: 'Merton Cheezmuncher', hasVideo: true, },
            { baseUrl: 'chicken', name: 'KFC', hasVideo: true, },
            { baseUrl: 'dog', name: 'Kojack', hasVideo: true, },
            { baseUrl: 'dragon', name: 'Adorable Rage', hasVideo: true, },
            { baseUrl: 'duck', name: 'Milton Mallard', hasVideo: true, },
            { baseUrl: 'knight', name: 'Palace Guard', hasVideo: true, },
            { baseUrl: 'llama', name: 'Sal-paca', hasVideo: true, },
            { baseUrl: 'monkey', name: 'Banana Muncher', hasVideo: true, },
            { baseUrl: 'hockey-player', name: 'Puck Face', hasVideo: true, },
            { baseUrl: 'monster-1', name: 'Bird Ball', hasVideo: true, },
            { baseUrl: 'tank', name: 'Rolling Destruction', hasVideo: true, },
            { baseUrl: 'monster-truck', name: 'Also Rolling Destruction', hasVideo: true, },
            { baseUrl: 'fairy', name: 'Princess Flutter', hasVideo: true, },
            { baseUrl: 'ape', name: 'Ceasar', hasVideo: true, }, 
            { baseUrl: 'monster-2', name: 'Grog', hasVideo: true, },
            { baseUrl: 'moose', name: 'Wally', hasVideo: true, },
            { baseUrl: 'eagle', name: 'Merica', hasVideo: true, },
            { baseUrl: 'rabbit', name: '4x Lucky', hasVideo: true, },
            { baseUrl: 'witch', name: 'Witchy Woman', hasVideo: true, },
            { baseUrl: 'tiger', name: 'Stripe', hasVideo: true, }, 
            { baseUrl: 'construction-worker', name: 'Bill The Builder', hasVideo: true, },
            { baseUrl: 'wizard', name: 'Gildorf', hasVideo: true, },
            { baseUrl: 'baseball-squirrel', name: 'The Natural', hasVideo: true, },
            { baseUrl: 'wiz1', name: 'The Wiz', hasVideo: true, },
            { baseUrl: 'scare-bear', name: 'Scare Bear' },
            { baseUrl: 'honest-ape', name: 'Honest Ape', hasVideo: true, },
        ];


        return items;
    }
}