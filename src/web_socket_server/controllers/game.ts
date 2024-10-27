import { Res } from '../types';
import { Ships } from '../types';
import { getUser } from '../models/users';
import { addNewGame, getGameTurn } from '../models/game';

export function createGame(ws: WebSocket, roomId: string) {
  const user = getUser(ws);
  if (!user) {
    ws.send(
      JSON.stringify({
        type: 'error',
        data: { message: 'User not found. Please register first.' },
      }),
    );
    return;
  }
  const gameId = addNewGame(user, roomId);
  

  const response = {
    type: Res.create_game,
    data: JSON.stringify({
      idGame: gameId,
      idPlayer: user.id,
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

export function getTurn(gameId: string) {
  const turn = getGameTurn(gameId);
  const response = {
    type: Res.turn,
    data: JSON.stringify({
      currentPlayer: turn,
    }),
    id: 0,
  };  
  return JSON.stringify(response);
}
