import { v4 as uuidv4 } from 'uuid';
import { Game, User } from '../types';

const games: Game[] = [];

export function getGameByRoomId(roomId: string) {
  const gamesWithThisRoom = games.filter((game) => game.roomId === roomId);
  return gamesWithThisRoom.length === 1 ? gamesWithThisRoom[0] : undefined;
}

export function addNewGame(player: User, roomId: string) {
  const existingGame = getGameByRoomId(roomId);
  
  if (existingGame) {
    existingGame.players.push(player);
    return existingGame.id;
  }
  const gameId = uuidv4();
  games.push({
    id: gameId,
    players: [player],
    turn: player.id,
    roomId,
  });
  return gameId;
}

export function getGameTurn(gameId: string) {
  return games.filter((game) => game.id === gameId)[0].turn;
}
