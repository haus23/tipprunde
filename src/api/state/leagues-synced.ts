import { atom } from 'recoil';
import { League } from '@/api/model/league';
import { syncedList } from '@/api/model/repository/synced-list';

export const leaguesSyncedState = atom<League[]>({
  key: 'leagues-stream',
  default: [],
  effects: [
    ({ setSelf }) => {
      return syncedList<League>(setSelf, `leagues`);
    },
  ],
});
