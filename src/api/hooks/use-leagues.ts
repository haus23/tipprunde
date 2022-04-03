import { useRecoilState, useRecoilValue } from 'recoil';
import { League } from '@/api/model/league';
import { createWithAutoId } from '@/api/model/repository/create-with-auto-id';
import { leaguesState } from '@/api/state/leagues-async';

export const useLeagues = () => {
  const [leagues, setLeagues] = useRecoilState(leaguesState);

  const create = async (league: League) => {
    league = await createWithAutoId<League>('leagues', 'league', league);
    setLeagues([...leagues, league]);
    return league;
  };

  return { leagues, create };
};
