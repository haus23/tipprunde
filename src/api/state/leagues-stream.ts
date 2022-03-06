import { atom } from 'recoil';
import { League } from '../model/league';
import { streamedList } from '../model/repository/streamed-list';

export const leaguesStreamState = atom<League[]>({
  key: 'leagues-stream',
  default: [],
  effects: [
    ({ setSelf }) => {
      return streamedList<League>(setSelf, `leagues`);
    },
  ],
});
