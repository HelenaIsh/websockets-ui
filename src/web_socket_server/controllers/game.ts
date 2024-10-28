import { Res, ShipStatus } from '../types';
import { Ship } from '../types';
import { getUser } from '../models/users';
import { addNewGame, addShips, getGameTurn, handleAttack, isGameFinished, getGameById, getGamePlayerById } from '../models/game';

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
  const gameId = addNewGame({...user, ws}, roomId);
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

export function startGame(gameId: string, playerId: string, ships: Ship[]) {
  addShips(gameId, playerId, ships);
  const response = {
    type: Res.start_game,
    data: JSON.stringify({
      ships: ships,
      currentPlayerIndex: playerId,
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


export function getAttackFeedback(gameId: string, x: number, y: number, playerId: string, ws: WebSocket) {
  const turn = getGameTurn(gameId);
  const game = getGameById(gameId); 
  const player = getGamePlayerById(gameId, playerId);
  const cellWasHitted = player.hits?.some(hit => hit.x === x && hit.y === y);
  
  if (turn !== playerId || game.players.length === 1 || cellWasHitted) return;
  const resultOfAttack = handleAttack(gameId, x, y, playerId, ws);
  
  const response = {
    type: Res.attack,
    data: JSON.stringify({
      position: {
        x,
        y
      },
      currentPlayer: playerId,
      status: resultOfAttack
    }),
    id: 0,
  };  
  return JSON.stringify(response);
  
}

export function checkIfGameFinished(gameId: string, playerId: string) {  
  if (isGameFinished(gameId, playerId)) {
    const response = {
      type: Res.finish,
      data: JSON.stringify({
        winPlayer: playerId
      }),
      id: 0,
    };
    return JSON.stringify(response);  
  }
  
}
