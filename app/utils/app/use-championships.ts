import { useParams } from 'react-router';

export function useChampionships() {
  const { championshipSlug: slug } = useParams();
  return { currentChampionship: { slug: slug ?? '' }, championships: [] };
}
