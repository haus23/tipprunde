import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useChampionships } from '@/api/hooks/use-championships';
import { currentChampionshipState } from '../state/current-championship';

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
