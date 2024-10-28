import { getWinners } from '../models/winners';
import { Res } from '../types';

export function updateWinners() {
  const response = {
    type: Res.update_winners,
    data: JSON.stringify(getWinners()),
  };
  return JSON.stringify(response);
}
