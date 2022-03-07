import { useRecoilValue } from 'recoil';
import { add } from '../model/repository/add';
import { Round } from '../model/round';
import { roundsStreamState } from '../state/rounds-stream';

export const useRounds = (championshipId?: string) => {
  const rounds = useRecoilValue(roundsStreamState(championshipId));

  const create = (round: Round) =>
    add<Round>(`championships/${championshipId}/rounds`, round);

  return { rounds, create };
};
