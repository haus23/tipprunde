import { RankingTable } from "#/components/ranking-table.tsx";
import { getArchivRanking } from "#/lib/archiv.server.ts";
import { archivChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/tabelle";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(archivChampionshipContext)!;
  const ranking = await getArchivRanking(championship.id);
  return { championship, ranking };
}

export default function ArchivTabelle({ loaderData }: Route.ComponentProps) {
  const { championship, ranking } = loaderData;

  return (
    <>
      <title>{`${championship.name} · Archiv · runde.tips`}</title>
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
    </>
  );
}
