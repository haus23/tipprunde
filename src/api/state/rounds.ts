import { orderBy } from 'firebase/firestore';
import { atomFamily } from 'recoil';
import { Round } from '@/api/model/round';
import { Championship } from '@/api/model/championship';
import { asyncList } from '@/api/model/repository/async-list';

export const roundsState = atomFamily<Round[], Championship['id']>({
  key: 'rounds',
  default: (championshipId) =>
    championshipId === ''
      ? []
      : asyncList<Round>(
          `championships/${championshipId}/rounds`,
          orderBy('nr')
        ),
});
