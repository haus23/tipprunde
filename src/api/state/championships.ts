import { atom } from 'recoil';
import { asyncList } from '../model/repository/async-list';
import { Championship } from '@/api/model/championship';

export const championshipsState = atom({
  key: 'championships',
  default: asyncList<Championship>('championships'),
});
