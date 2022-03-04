import { useChampionships } from './api/hooks/use-championships';

function App() {
  const { championships } = useChampionships();

  return (
    <div>
      <h1>runde.tips</h1>
      <h2>
        {championships.length ? championships[0].title : 'Noch kein Turnier'}
      </h2>
    </div>
  );
}

export default App;
