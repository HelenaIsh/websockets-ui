import { User } from '../types';
import { addUser } from '../models/users';

export function registerNewUser(newUser: User) {
    const index = addUser(newUser);
      const response = {
        type: 'reg',
        data: JSON.stringify({
          name: newUser.name,
          index: index,
          error: false,
          errorText: ''
        }),
        id: 0
      }
      return JSON.stringify(response);
}