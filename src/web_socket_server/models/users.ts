import { User } from '../types';

const users: User[] = [];

export function addUser(newUser: User) {
  users.push(newUser);
  return users.length;
}
