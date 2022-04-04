import { useRecoilState } from 'recoil';
import { createWithId } from '@/api/model/repository/create-with-id';
import { Championship } from '@/api/model/championship';
import { championshipsState } from '@/api/state/championships';

export const useChampionships = () => {
  const [championships, setChampionships] = useRecoilState(championshipsState);

  const create = async (championship: Championship) => {
    championship = await createWithId<Championship>(
      'championships',
      championship
    );
    setChampionships([...championships, championship]);
    return championship;
  };

  return { championships, create };
};
