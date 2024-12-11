import { requireChampionship } from '#/utils/app/championships.server';
import type { Route } from './+types/_route';

export const meta = [
  { title: 'Spieler - runde.tips' },
  {
    name: 'description',
    content: 'Tipps pro Spieler',
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const championship = await requireChampionship(params.championshipSlug);
  return { championship };
}

export default function PlayersRoute() {
  return <h1 className="font-medium text-3xl">Spieler</h1>;
}
