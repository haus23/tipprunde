import { requireChampionship } from '#/utils/app/championships.server';
import type { Route } from './+types/_route';

export const meta = [
  { title: 'Tabelle - runde.tips' },
  {
    name: 'description',
    content: 'Aktueller Tabellenstand der Haus23 Tipprunde',
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const championship = await requireChampionship(params.championshipSlug);
  return { championship };
}

export default function TablesRoute() {
  return <h1 className="font-medium text-3xl">Aktuelle Tabelle</h1>;
}
