import { Res } from '../types';
import { registerNewUser } from '../controllers/registration';
import {
  addNewUserToTheRoom,
  createNewRoom,
  updateRoom,
} from '../controllers/rooms';
import { updateWinners } from '../controllers/winners';
import { createGame, getTurn, startGame } from '../controllers/game';

export default (type: Res, data: any, ws: any) => {
  switch (type) {
    case Res.reg:
      ws.send(registerNewUser(data, ws));
      ws.send(updateRoom());
      ws.send(updateWinners());
      break;
    case Res.create_room:
      createNewRoom(ws);
      ws.send(updateRoom());
      break;
    case Res.add_user_to_room:
      const roomId = data.indexRoom;
      addNewUserToTheRoom(roomId, ws);
      ws.send(createGame(ws, roomId));
      break;
    case Res.add_ships:
      const userId = data.indexPlayer;
      const ships = data.ships;
      const gameId = data.gameId;
      ws.send(startGame(userId, ships));  
      ws.send(getTurn(gameId));
      break;
    default:
      () => {
        console.log('default');
      };
  }
};
