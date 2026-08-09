import { ChevronLeftIcon } from "lucide-react";
import { Link, data } from "react-router";

import { RankingTable } from "#/components/ranking-table.tsx";
import { getArchivChampionship } from "#/lib/archiv.server.ts";

import type { Route } from "./+types/detail";

export async function loader({ params }: Route.LoaderArgs) {
  const result = await getArchivChampionship(params.slug);
  if (!result) throw data("Turnier nicht gefunden.", { status: 404 });

  return result;
}

export default function ArchivChampionship({ loaderData }: Route.ComponentProps) {
  const { championship, ranking } = loaderData;

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <title>{`${championship.name} · Archiv · runde.tips`}</title>
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link
          to="/archiv"
          className="text-subtle hover:text-app focus-visible:ring-accent mb-1 flex items-center gap-1 rounded-sm text-xs transition-colors outline-none focus-visible:ring-2"
        >
          <ChevronLeftIcon className="size-3" />
          Archiv
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <p className="text-subtle text-sm">Abschlusstabelle</p>
      </div>

      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
      ) : (
        <RankingTable
          ranking={ranking}
          showExtras={championship.extraQuestionPointsPublished ?? false}
          currentUserId={undefined}
          isOngoing={false}
          linkPlayers={false}
        />
      )}
    </div>
  );
}
