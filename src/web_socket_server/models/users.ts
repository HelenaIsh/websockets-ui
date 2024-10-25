import { User } from '../types';

const users: User[] = [];

export function addUser(newUser: User) {
  const index = users.length + 1;
  users.push({...newUser, index});
  return index;
}

export function getCurrentUser(): User {
  return users[users.length - 1];
}
