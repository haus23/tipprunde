import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { championshipsState } from '@/api/state/championships';
import { currentChampionshipState } from '@/views/backyard/state/current-championship';

export const useCurrentChampionship = () => {
  const [championship, setChampionship] = useRecoilState(
    currentChampionshipState
  );
  const championships = useRecoilValue(championshipsState);

  useEffect(() => {
    if (!championship && championships.length > 0) {
      setChampionship(championships[0]);
    }
  }, [championship, championships, setChampionship]);

  return { championship, setChampionship };
};
