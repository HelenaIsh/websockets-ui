import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const users = new Map<WebSocket, User>();

export function addUser(newUser: User, ws: WebSocket) {
  const foundUser = users.get(ws);
  if (foundUser) {
    const wrongPasswordError = foundUser.password !== newUser.password;
        return { error: wrongPasswordError, index: foundUser.index };
  }
  const id = uuidv4();
  const index = users.size + 1;
  users.set(ws, { ...newUser, index, id });  
  return { error: false, index };
}

export function getUser(ws: WebSocket) {
  return users.get(ws);
}
