import { Player } from "./player";


export class GameSetupConfig {
    player1: Player;
    player2: Player;

    gameType: 'Physical' | 'Virtual' | 'Both'  | 'AZ' | 'UT' | 'NV'  | 'MOON' | 'PAC' | 'ASTRIODS' | 'SKEET';
}