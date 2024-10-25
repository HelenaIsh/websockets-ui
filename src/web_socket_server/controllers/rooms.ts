import { Res, User } from '../types';
import { addNewRoom, getOneUserRooms } from '../models/rooms';
import { getCurrentUser } from '../models/users';
import { v4 as uuidv4 } from 'uuid';

export function updateRoom() {
  const rooms = getOneUserRooms();
  const response = {
    type: Res.update_room,
    data: JSON.stringify(rooms),
    id: 0,
  };
  console.log('from controllers, rooms, update room: ',rooms, response)
  return JSON.stringify(response);
}


export function createNewRoom() {
  const currentUser: User = getCurrentUser();
  const newRoom = {
    roomId: uuidv4(),
    roomUsers: [{
      name: currentUser.name,
      index: currentUser.index || 0
    }]
  };
  addNewRoom(newRoom);
}
