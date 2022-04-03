import { atom } from 'recoil';
import { syncedList } from '@/api/model/repository/synced-list';
import { Team } from '@/api/model/team';

export const teamsSyncedState = atom<Team[]>({
  key: 'teams-synced',
  default: [],
  effects: [
    ({ setSelf }) => {
      return syncedList<Team>(setSelf, `teams`);
    },
  ],
});
