import { useRecoilValue } from 'recoil';
import { championshipsState } from '../state/championships';

export const useChampionships = () => {
  const championships = useRecoilValue(championshipsState);

  return { championships };
};
