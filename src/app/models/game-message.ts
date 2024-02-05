export class GameMessage {
    sender: 'Client' | 'Server';
    messageType: 'PLAYER_1_SCORED' | 'PLAYER_2_SCORED' | 'GAME_OVER' | 'GAME_STARTED' | 'VIRTUAL_GAME_STARTED';
    additionalData?: any;
}