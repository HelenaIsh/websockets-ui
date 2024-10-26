import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const users: User[] = [];

export function addUser(newUser: User, ws: WebSocket) {
  const foundUser = users.filter(
    (existingUser) => existingUser.name === newUser.name,
  )[0];
  if (foundUser) {
    const wrongPasswordError =
      foundUser.password !== newUser.password ? true : false;
    return { error: wrongPasswordError, index: foundUser.index };
  }
  const id = uuidv4();
  const index = users.length + 1;
  users.push({ ...newUser, index, id, ws });
  console.log(users);
  
  return { error: false, index };
}

export function getCurrentUser(): User {
  return users[users.length - 1];
}
