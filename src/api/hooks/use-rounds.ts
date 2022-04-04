import { useRecoilState } from 'recoil';
import { roundsState } from '@/api/state/rounds';
import { Round } from '@/api/model/round';
import { createWithId } from '@/api/model/repository/create-with-id';

export const useRounds = (championshipId?: string) => {
  const [rounds, setRounds] = useRecoilState(roundsState(championshipId ?? ''));

  const create = async (round: Round) => {
    round = await createWithId<Round>(
      `championships/${championshipId}/rounds`,
      round
    );
    setRounds([...rounds, round]);
    return round;
  };

  return { rounds, create };
};
