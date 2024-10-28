import { Room, User } from '../types';

const rooms: Room[] = [];

export function getOneUserRooms() {
  return rooms.filter((room) => room.users.length === 1);
}

export function addNewRoom(newRoom: Room) {
  rooms.push(newRoom);
}

export function addNewUserToRoom(roomId: string, user: User) {
  const room = rooms.filter((room) => room.id === roomId)[0];
  if (!room.users.some((roomUser: User) => roomUser.id === user.id)) {
    room.users.push(user);
  }
}
