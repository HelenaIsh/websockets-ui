import { User, isUser, Res } from '../types';
import { addUser } from '../models/users';

export function registerNewUser(newUser: User) {
  const isUserConst = isUser(newUser);
  const index = addUser(newUser);
  const response = {
    type: Res.reg,
    data: JSON.stringify({
      name: newUser.name,
      index: index,
      error: isUserConst ? false : true,
      errorText: isUserConst ? '' : 'not a valid user',
    }),
    id: 0,
  };
  return JSON.stringify(response);
}
