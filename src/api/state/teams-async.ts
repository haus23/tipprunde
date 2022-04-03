import { atom } from 'recoil';
import { asyncList } from '../model/repository/async-list';
import { Team } from '@/api/model/team';

export const teamsState = atom({
  key: 'teams-async',
  default: asyncList<Team>('teams'),
});
