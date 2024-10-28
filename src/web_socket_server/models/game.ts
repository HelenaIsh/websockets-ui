import { v4 as uuidv4 } from 'uuid';
import { Game, Ship, ShipStatus, User } from '../types';

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

export function addShips(gameId: string, playerId: string, ships: Ship[]) {
  const game = getGameById(gameId);
  const player = game.players.filter(player => player.id === playerId)[0];
  player.ships = ships;
}

export function getGameById(gameId: string) {
  return games.filter((game) => game.id === gameId)[0];
}

export function getGameTurn(gameId: string) {
  return getGameById(gameId).turn;
}

export function getOpponent(gameId: string, playerId: string) {
  const game = getGameById(gameId);
  const players = game.players;
  return players.filter(player => player.id !== playerId)[0].id;
}

function getGamePlayerById(gameId: string, playerId: string) {
  const game = getGameById(gameId);
  const players = game.players;
  return players.filter(player => player.id !== playerId)[0];
}

export function getUserShips(gameId: string, playerId: string) {
  return getGamePlayerById(gameId, playerId).ships;
}

export function handleAttack(gameId: string, x: number, y: number, playerId: string) {
  const existingGame = getGameById(gameId);
  const ships = getUserShips(gameId, playerId);
  if (!ships) {
    return;
  }
  
  for (let ship of ships) {
    const cells = [];

    for (let i = 0; i < ship.length; i++) {
      const cellX = ship.position.x + (!ship.direction ? i : 0);
      const cellY = ship.position.y + (ship.direction ? i : 0);
      cells.push({ x: cellX, y: cellY });
    }  
    const hitCell = cells.find(cell => cell.x === x && cell.y === y);    
    if (hitCell) {
      if (!ship.hits) {
        ship.hits = [hitCell];
      } else if (!ship.hits.some(hit => hit.x === x && hit.y === y)) {
        ship.hits.push(hitCell);
      }
      

      if (ship.hits.length === ship.length) {
        ship.status = ShipStatus.killed;
        
        existingGame.turn = playerId;
        return ShipStatus.killed;
      }
      existingGame.turn = playerId;
      return ShipStatus.shot;
    }
  }

  
  existingGame.turn = getOpponent(gameId, playerId);
  return ShipStatus.miss;
}

export function isGameFinished(gameId: string, playerId: string) {
  const ships = getUserShips(gameId, playerId);
  return ships?.every(ship => ship.status === ShipStatus.killed);
}


