import { Res, Room, User } from '../types';
import { addNewRoom, getOneUserRooms, addNewUserToRoom } from '../models/rooms';
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../models/users';

export function updateRoom() {
  const rooms = getOneUserRooms();

  const roomsFormattedForSever = rooms.map((room) => {
    return {
      roomId: room.id,
      roomUsers: room.users.map((user) => {
        return {
          name: user.name,
          index: user.index,
        };
      }),
    };
  });
  const response = {
    type: Res.update_room,
    data: JSON.stringify(roomsFormattedForSever),
    id: 0,
  };

  return JSON.stringify(response);
}

export function createNewRoom(ws: WebSocket) {
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
  const newRoom: Room = {
    id: uuidv4(),
    users: [user],
  };

  addNewRoom(newRoom);
}

export function addNewUserToTheRoom(roomId: string, ws: WebSocket) {
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
  addNewUserToRoom(roomId, user);
}
