import { useRecoilValue } from 'recoil';
import { leaguesSyncedState } from '@/api/state/leagues-synced';
import { League } from '@/api/model/league';
import { createWithSequenceId } from '@/api/model/repository/create-with-sequence-id';

export const useLeaguesSynced = () => {
  const leagues = useRecoilValue(leaguesSyncedState);
  const create = (league: League) =>
    createWithSequenceId<League>('leagues', 'league', league);

  return { leagues, create };
};
