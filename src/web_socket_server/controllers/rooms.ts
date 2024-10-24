import { Res } from '../types';
import { getOneUserRooms } from '../models/rooms';

export function updateRoom() {
  const rooms = getOneUserRooms();
  const response = {
    type: Res.update_room,
    data: JSON.stringify(rooms),
    id: 0,
  };
  console.log(JSON.stringify(response));
  return JSON.stringify(response);
}
