import { useChampionships } from '@/api/hooks/use-championships';
import { Championship } from '@/api/model/championship';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

const currentChampionshipState = atom<Championship | null>({
  key: 'backyard-currentChampionship-state',
  default: null,
});

export const useCurrentChampionship = () => {
  const [championship, setChampionship] = useRecoilState(
    currentChampionshipState
  );
  const { championships } = useChampionships();

  useEffect(() => {
    if (!championship && championships.length > 0) {
      setChampionship(championships[0]);
    }
  }, []);

  return { championship, setChampionship };
};
