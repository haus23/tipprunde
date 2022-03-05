import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { currentChampionshipState } from '../state/current-championship';
import { championshipsState } from '@/api/state/championships';

export const useCurrentChampionship = () => {
  const [championship, setChampionship] = useRecoilState(
    currentChampionshipState
  );
  const championships = useRecoilValue(championshipsState);

  useEffect(() => {
    if (!championship && championships.length > 0) {
      setChampionship(championships[0]);
    }
  }, []);

  return { championship, setChampionship };
};
