import { useLeagues } from '@/api/hooks/use-leagues';
import { League } from '@/api/model/league';
import ContentPanel from '@/backyard/components/ContentPanel';
import LeagueForm from '@/backyard/components/forms/LeagueForm';

function Matches() {
  const { create } = useLeagues();
  const save = (league: League) => {
    console.log('Neue Liga', league);
  };

  return (
    <ContentPanel title="Spiele">
      <LeagueForm onSave={create} onCancel={() => {}} />
    </ContentPanel>
  );
}

export default Matches;
