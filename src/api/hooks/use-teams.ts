import { useRecoilState, useRecoilValue } from 'recoil';
import { createWithAutoId } from '@/api/model/repository/create-with-auto-id';
import { teamsState } from '@/api/state/teams-async';
import { Team } from '@/api/model/team';

export const useTeams = () => {
  const [teams, setTeams] = useRecoilState(teamsState);

  const create = async (team: Team) => {
    team = await createWithAutoId<Team>('teams', 'team', team);
    setTeams([...teams, team]);
    return team;
  };

  return { teams, create };
};
