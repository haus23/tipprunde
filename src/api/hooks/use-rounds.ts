import { useRecoilValue } from 'recoil';
import { KeyType } from '../model/base';
import { add } from '../model/repository/add';
import { Round } from '../model/round';
import { roundsStreamState } from '../state/rounds-stream';

export const useRounds = (championshipId: KeyType | undefined) => {
  const rounds = useRecoilValue(roundsStreamState(championshipId));

  const create = (round: Round) =>
    add<Round>(`championships/${championshipId}/rounds`, round);

  return { rounds, create };
};
