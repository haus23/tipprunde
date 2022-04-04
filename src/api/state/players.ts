import { atom } from 'recoil';
import { asyncList } from '../model/repository/async-list';
import { Player } from '@/api/model/player';

export const playersState = atom({
  key: 'players',
  default: asyncList<Player>('players'),
});
