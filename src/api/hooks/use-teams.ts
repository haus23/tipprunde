import { useRecoilState, useRecoilValue } from 'recoil';
import { createWithSequenceId } from '@/api/model/repository/create-with-sequence-id';
import { teamsState } from '@/api/state/teams-async';
import { Team } from '@/api/model/team';

export const useTeams = () => {
  const [teams, setTeams] = useRecoilState(teamsState);

  const create = async (team: Team) => {
    team = await createWithSequenceId<Team>('teams', 'team', team);
    setTeams([...teams, team]);
    return team;
  };

  return { teams, create };
};
