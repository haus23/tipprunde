import { useRecoilValue } from 'recoil';
import { Championship } from '../model/championship';
import { add } from '../model/repository/add';
import { championshipsStreamState } from '../state/championships-stream';

export const useChampionships = () => {
  const championships = useRecoilValue(championshipsStreamState);

  const create = (championship: Championship) =>
    add<Championship>('championships', championship);

  return { championships, create };
};
