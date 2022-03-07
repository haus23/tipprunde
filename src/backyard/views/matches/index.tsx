import { useLeagues } from '@/api/hooks/use-leagues';
import { League } from '@/api/model/league';
import ContentPanel from '@/backyard/components/ContentPanel';
import LeagueForm from '@/backyard/components/forms/LeagueForm';
import { useNotify } from '@/core/hooks/use-notify';

function Matches() {
  const { create } = useLeagues();
  const notify = useNotify();

  const handleCreate = (league: League) => {
    notify(create(league), `Neue Liga${league.name}`);
  };

  return (
    <ContentPanel title="Spiele">
      <LeagueForm onSave={handleCreate} onCancel={() => {}} />
    </ContentPanel>
  );
}

export default Matches;
