import { User, Res } from '../types';
import { addUser } from '../models/users';

export function registerNewUser(newUser: User, ws: WebSocket) {
  const {error, index} = addUser(newUser, ws);
  const response = {
    type: Res.reg,
    data: JSON.stringify({
      name: newUser.name,
      index: index,
      error,
      errorText: 'wrongPassword',
    }),
    id: 0,
  };
  return JSON.stringify(response);
}
