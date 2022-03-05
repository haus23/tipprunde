import { atom } from 'recoil';
import { Championship } from '../model/championship';
import { streamedList } from '../model/repository/streamed-list';

export const championshipsStreamState = atom<Championship[]>({
  key: 'championships-stream',
  default: [],
  effects: [
    ({ setSelf }) => streamedList<Championship>(setSelf, 'championships'),
  ],
});
