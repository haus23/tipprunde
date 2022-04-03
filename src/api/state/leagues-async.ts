import { atom } from 'recoil';
import { asyncList } from '../model/repository/async-list';
import { League } from '@/api/model/league';

export const leaguesState = atom({
  key: 'leagues-async',
  default: asyncList<League>('leagues'),
});
