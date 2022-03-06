import { useRecoilValue } from 'recoil';
import { League } from '../model/league';
import { addWithIncrement } from '../model/repository/add-with-increment';
import { leaguesStreamState } from '../state/leagues-stream';

export const useLeagues = () => {
  const leagues = useRecoilValue(leaguesStreamState);

  const create = (league: League) =>
    addWithIncrement<League>('leagues', 'league', league);

  return { leagues, create };
};
