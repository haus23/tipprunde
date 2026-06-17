import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { RankingTable } from "#/components/ranking-table.tsx";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { SessionUser } from "#/lib/session.ts";

export const Route = createFileRoute("/_championship/tabelle")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      return context.queryClient.ensureQueryData(rankingQueryOptions(id));
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <TabelleView championship={championship} user={user} />;
}

function TabelleView({
  championship,
  user,
}: {
  championship: NonNullable<ReturnType<typeof Route.useRouteContext>["championship"]>;
  user: SessionUser | null;
}) {
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championship.id));
  const showExtras = championship.extraQuestionPointsPublished ?? false;
  const isOngoing = !championship.completed;

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
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
          showExtras={showExtras}
          currentUserId={user?.id}
          championshipId={championship.id}
          isOngoing={isOngoing}
        />
      )}
    </div>
  );
}
