import { atom } from 'recoil';
import { Championship } from '../model/championship';
import { asyncList } from '../model/repository/async-list';

export const championshipsState = atom({
  key: 'championships',
  default: asyncList<Championship>('championships'),
});
