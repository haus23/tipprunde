import { Link } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import { RankingTable } from "#/components/ranking-table.tsx";
import { viewedChampionshipContext, userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/tabelle";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext);
  const user = context.get(userContext);

  if (!championship) return { championship: null, ranking: [], currentUserId: user?.id };

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
  const scoped = useScopedPath();

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
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">
            {championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
          </span>
          <Link
            to={scoped("/verlauf")}
            prefetch="intent"
            className="text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
          >
            Verlauf
          </Link>
        </div>
      </div>

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
