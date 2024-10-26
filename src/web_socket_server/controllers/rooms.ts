import { Res, Room, User } from '../types';
import { addNewRoom, getOneUserRooms } from '../models/rooms';
import { v4 as uuidv4 } from 'uuid';
import { getUser } from '../models/users';

export function updateRoom() {
  const rooms = getOneUserRooms();
  const response = {
    type: Res.update_room,
    data: JSON.stringify(rooms),
    id: 0,
  };
  console.log('from controllers, rooms, update room: ', rooms, response);
  return JSON.stringify(response);
}

export function createNewRoom(ws: WebSocket) {
  const user = getUser(ws); 
    
    if (!user) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'User not found. Please register first.' }
        }));
        return;
    }
    
    const newRoom: Room = {
        roomId: uuidv4(),
        roomUsers: [
            {
                name: user.name,
                index: user.index,
            }
        ],
    };
    
    addNewRoom(newRoom);
}
