import { useRecoilValue } from 'recoil';
import { createWithAutoId } from '@/api/model/repository/create-with-auto-id';
import { Team } from '@/api/model/team';
import { teamsSyncedState } from '@/api/state/teams-synced';

export const useTeamsSynced = () => {
  const teams = useRecoilValue(teamsSyncedState);
  const create = (team: Team) => createWithAutoId<Team>('teams', 'team', team);

  return { teams, create };
};
