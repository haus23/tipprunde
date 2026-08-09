import { RankingTable } from "#/components/ranking-table.tsx";
import { publicChampionshipContext, userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/tabelle";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(publicChampionshipContext);
  const user = context.get(userContext);

  if (!championship) return { championship: null, ranking: [], currentUserId: user?.id };

  return {
    championship: {
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

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <title>Tabelle · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <title>{`Tabelle · ${championship.name} · runde.tips`}</title>
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <p className="text-subtle text-sm">
          {championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
        </p>
      </div>

      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
      ) : (
        <RankingTable
          ranking={ranking}
          showExtras={championship.extraQuestionPointsPublished ?? false}
          currentUserId={currentUserId}
          isOngoing={!championship.completed}
        />
      )}
    </div>
  );
}
