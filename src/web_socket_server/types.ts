export enum Res {
  reg = 'reg',
  update_room = 'update_room',
  update_winners = 'update_winners',
  create_room = 'create_room',
  create_game = 'create_game',
  start_game = 'start_game',
  add_user_to_room = 'add_user_to_room',
  turn = 'turn',
  attack = 'attack',
  finish = 'finish',
  add_ships = 'add_ships',
}

enum shipSizes {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge'
}

export interface Message {
  type: string;
  data: unknown;
  id: 0;
}

export interface User {
  name: string;
  password: string;
  index?: number;
}

export interface Room {
  roomId: number | string;
  roomUsers: {
    name: string;
    index: number | string;
  }[];
}

export interface Winner {
  name: string;
  wins: number;
}

export interface Ships {
  position: {
    x: number,
    y: number
  },
  direction: boolean,
  type: shipSizes,
  length: number
}

export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'password' in obj
  );
}
