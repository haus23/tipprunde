import { requireChampionship } from '#/utils/app/championships.server';
import type { Route } from './+types/_route';

export const meta = [
  { title: 'Spiele - runde.tips' },
  {
    name: 'description',
    content: 'Tipps pro Spiel',
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const championship = await requireChampionship(params.championshipSlug);
  return { championship };
}

export default function MatchesRoute() {
  return <h1 className="font-medium text-3xl">Spiele</h1>;
}
