import { RankingTable } from "#/components/ranking-table.tsx";
import { viewedChampionshipContext, userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/tabelle";

export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const user = context.get(userContext);

  return {
    championship: {
      id: championship.id,
      name: championship.name,
      completed: championship.completed,
      extraQuestionPointsPublished: championship.extraQuestionPointsPublished,
    },
    ranking: await getRanking(championship.id),
    currentUserId: user?.id,
  };
}

export default function Tabelle({ loaderData }: Route.ComponentProps) {
  const { championship, ranking, currentUserId } = loaderData;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <title>{`Tabelle · ${championship.name} · runde.tips`}</title>
      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
      ) : (
        <RankingTable
          ranking={ranking}
          showExtras={championship.extraQuestionPointsPublished ?? false}
          currentUserId={currentUserId}
          isOngoing={!championship.completed}
          championshipId={championship.id}
        />
      )}
    </div>
  );
}
