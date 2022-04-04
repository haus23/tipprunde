import { atom } from 'recoil';
import { Championship } from '@/api/model/championship';

export const currentChampionshipState = atom<Championship | null>({
  key: 'backyard-currentChampionship-state',
  default: null,
});
