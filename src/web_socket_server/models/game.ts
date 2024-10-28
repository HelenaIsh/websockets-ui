import { v4 as uuidv4 } from 'uuid';
import { Game, Res, Ship, ShipStatus, User } from '../types';

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
  const player = game.players.filter((player) => player.id === playerId)[0];
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
  return players.filter((player) => player.id !== playerId)[0].id;
}

export function getGamePlayerById(gameId: string, playerId: string) {
  const game = getGameById(gameId);
  const players = game.players;
  return players.filter((player) => player.id !== playerId)[0];
}

export function getUserShips(gameId: string, playerId: string) {
  return getGamePlayerById(gameId, playerId).ships;
}

export function handleAttack(
  gameId: string,
  x: number,
  y: number,
  playerId: string,
  ws: WebSocket,
) {
  const existingGame = getGameById(gameId);
  const ships = getUserShips(gameId, playerId);
  if (!ships) {
    return;
  }
  const player = getGamePlayerById(gameId, playerId);
  if (player.hits) {
    player.hits.push({ x, y });
  } else {
    player.hits = [{ x, y }];
  }

  for (let ship of ships) {
    const cells = [];

    for (let i = 0; i < ship.length; i++) {
      const cellX = ship.position.x + (!ship.direction ? i : 0);
      const cellY = ship.position.y + (ship.direction ? i : 0);
      cells.push({ x: cellX, y: cellY });
    }
    const hitCell = cells.find((cell) => cell.x === x && cell.y === y);
    if (hitCell) {
      if (!ship.hits) {
        ship.hits = [hitCell];
      } else if (!ship.hits.some((hit) => hit.x === x && hit.y === y)) {
        ship.hits.push(hitCell);
      }

      if (ship.hits.length === ship.length) {
        ship.status = ShipStatus.killed;

        existingGame.turn = playerId;
        markShipAsKilled(ship, playerId, ws);
        markSurroundingCellsAsMiss(ship, playerId, ws, gameId);
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
  return ships?.every((ship) => ship.status === ShipStatus.killed);
}

function markShipAsKilled(ship: Ship, playerId: string, ws: WebSocket) {
  for (let i = 0; i < ship.length; i++) {
    const x = ship.position.x + (!ship.direction ? i : 0);
    const y = ship.position.y + (ship.direction ? i : 0);

    const response = {
      type: Res.attack,
      data: JSON.stringify({
        position: {
          x,
          y,
        },
        currentPlayer: playerId,
        status: ShipStatus.killed,
      }),
      id: 0,
    };
    ws.send(JSON.stringify(response));
  }
}

function markSurroundingCellsAsMiss(
  ship: Ship,
  playerId: string,
  ws: WebSocket,
  gameId: string,
) {
  console.log('markSurroundingCellsAsMiss', ship);

  for (let i = 0; i < ship.length; i++) {
    const x = ship.position.x + (!ship.direction ? i : 0);
    const y = ship.position.y + (ship.direction ? i : 0);

    const surroundingCells = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];

    for (let cell of surroundingCells) {
      const shipIncludesThisCell = ship.hits?.some(
        (hit) => hit.x === cell.x && hit.y === cell.y,
      );
      if (
        cell.x >= 0 &&
        cell.x < 10 &&
        cell.y >= 0 &&
        cell.y < 10 &&
        !shipIncludesThisCell
      ) {
        const player = getGamePlayerById(gameId, playerId);
        player.hits?.push({ x: cell.x, y: cell.y });

        const response = {
          type: Res.attack,
          data: JSON.stringify({
            position: {
              x: cell.x,
              y: cell.y,
            },
            currentPlayer: playerId,
            status: ShipStatus.miss,
          }),
          id: 0,
        };
        ws.send(JSON.stringify(response));
      }
    }
  }
}
