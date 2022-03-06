import ContentPanel from '@/backyard/components/ContentPanel';
import { useCurrentChampionship } from '@/backyard/hooks/use-current-championship';

function Championship() {
  const { championship } = useCurrentChampionship();

  return <ContentPanel title={championship?.title}></ContentPanel>;
}

export default Championship;
