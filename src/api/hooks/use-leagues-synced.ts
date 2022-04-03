import { useRecoilValue } from 'recoil';
import { leaguesSyncedState } from '@/api/state/leagues-synced';

export const useLeaguesSynced = () => {
  const leagues = useRecoilValue(leaguesSyncedState);

  return { leagues };
};
