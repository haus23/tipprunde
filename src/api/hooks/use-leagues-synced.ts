import { useRecoilValue } from 'recoil';
import { leaguesSyncedState } from '@/api/state/leagues-synced';
import { League } from '@/api/model/league';
import { createWithAutoId } from '@/api/model/repository/create-with-auto-id';

export const useLeaguesSynced = () => {
  const leagues = useRecoilValue(leaguesSyncedState);
  const create = (league: League) =>
    createWithAutoId<League>('leagues', 'league', league);

  return { leagues, create };
};
