import { useRecoilValue } from 'recoil';
import { createWithSequenceId } from '@/api/model/repository/create-with-sequence-id';
import { Team } from '@/api/model/team';
import { teamsSyncedState } from '@/api/state/teams-synced';

export const useTeamsSynced = () => {
  const teams = useRecoilValue(teamsSyncedState);
  const create = (team: Team) =>
    createWithSequenceId<Team>('teams', 'team', team);

  return { teams, create };
};
