export class PlayerAvatar {
    baseUrl: string;
    name?: string;
    points?: number;
    totalPlays?: number;

    static getAll(): PlayerAvatar[] {
        const items = [
            { baseUrl: 'mouse', name: 'Merton Cheezmuncher' },
            { baseUrl: 'bear', name: 'Fractal Bear' },
            { baseUrl: 'cat', name: 'Pretty Kitty' },
            { baseUrl: 'chicken', name: 'KFC' },
            { baseUrl: 'dog', name: 'Kojack' },
            { baseUrl: 'dragon', name: 'Adorable Rage' },
            { baseUrl: 'duck', name: 'Milton Mallard' },
            { baseUrl: 'knight', name: 'Palace Guard' },
            { baseUrl: 'llama', name: 'Sal-paca' },
            { baseUrl: 'lion', name: 'Leonardo' },
            { baseUrl: 'monkey', name: 'Banana Muncher' },
            { baseUrl: 'hockey-player', name: 'Puck Face' },
            { baseUrl: 'monster-1', name: 'Bird Ball' },
            { baseUrl: 'tank', name: 'Rolling Destruction' },
            { baseUrl: 'monster-truck', name: 'Also Rolling Destruction' },
            { baseUrl: 'fairy', name: 'Princess Flutter' },
            { baseUrl: 'snake', name: 'Stan' },
            { baseUrl: 'ape', name: 'Ceasar' },
            { baseUrl: 'monster-2', name: 'Grog' },
            { baseUrl: 'moose', name: 'Wally' },
            { baseUrl: 'eagle', name: 'Merica' },
            { baseUrl: 'rabbit', name: '4x Lucky' },
            { baseUrl: 'witch', name: 'Witchy Woman' },
            { baseUrl: 'tiger', name: 'Stripe' },
            { baseUrl: 'troll', name: 'Very Sheri' },
            { baseUrl: 'construction-worker', name: 'Bill The Builder' },
            { baseUrl: 'unicorn', name: 'Candy' },
            { baseUrl: 'werewolf', name: 'Alex' },
            { baseUrl: 'wizard', name: 'Gildorf' }
        ];


        return items;
    }
}
