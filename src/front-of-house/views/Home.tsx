import { useChampionships } from '@/api/hooks/use-championships';

function Home() {
  const { championships } = useChampionships();
  return (
    <div>
      <h2>
        {championships.length ? championships[0].title : 'Noch kein Turnier'}
      </h2>
    </div>
  );
}

export default Home;
