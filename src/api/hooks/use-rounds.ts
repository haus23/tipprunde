import { Championship } from '../model/championship';
import { Round } from '../model/round';

export const useRounds = (championshipId: Championship['id']) => {
  return { rounds: [] as Round[] };
};
