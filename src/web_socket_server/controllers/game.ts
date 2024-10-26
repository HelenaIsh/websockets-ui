import { Res } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Ships } from '../types';

export function createGame(roomId: string) {
  const response = {
    type: Res.create_game,
    data: JSON.stringify({
      idGame: roomId,
      idPlayer: uuidv4(),
    }),
    id: 0,
  };
  return JSON.stringify(response);
}

export function startGame(userId: string, ships: Ships) {
  const response = {
    type: Res.start_game,
    data: JSON.stringify({
      ships: ships,
      currentPlayerIndex: userId,
    }),
    id: 0,
  };
  return JSON.stringify(response);
}
