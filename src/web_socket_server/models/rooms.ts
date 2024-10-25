import { Room } from '../types';

const rooms: Room[] = [];

export function getOneUserRooms() {
  return rooms.filter((room) => room.roomUsers.length === 1);
}

export function addNewRoom(newRoom: Room) {
  rooms.push(newRoom);
}