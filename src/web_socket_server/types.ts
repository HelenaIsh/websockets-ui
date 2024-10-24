export enum Res {
  reg = 'reg',
  update_room = 'update_room',
  update_winners = 'update_winners',
  create_game = 'create_game',
  start_game = 'start_game',
  turn = 'turn',
  attack = 'attack',
  finish = 'finish',
}

export interface User {
    name: string,
    password: string
}

export function isUser(obj: any): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'name' in obj &&
        'password' in obj
    );
}

