import { orderBy } from 'firebase/firestore';
import { atomFamily } from 'recoil';
import { Championship } from '../model/championship';
import { streamedList } from '../model/repository/streamed-list';
import { Round } from '../model/round';

export const roundsStreamState = atomFamily<Round[], Championship['id']>({
  key: 'rounds-stream',
  default: [],
  effects: (championshipId) => [
    ({ setSelf }) => {
      if (typeof championshipId === 'undefined') setSelf([]);

      return streamedList<Round>(
        setSelf,
        `championships/${championshipId}/rounds`,
        orderBy('nr')
      );
    },
  ],
});
