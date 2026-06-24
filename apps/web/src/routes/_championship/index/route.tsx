import { createFileRoute } from "@tanstack/react-router";

import { archivPreviewQueryOptions } from "#/lib/archiv.ts";
import { pageTitle } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import { currentMatchesQueryOptions } from "#/lib/spiele.ts";

import { ChampionshipDashboard } from "./-championship-dashboard.tsx";

export const Route = createFileRoute("/_championship/")({
  loader: async ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      await Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(currentMatchesQueryOptions(id)),
        context.queryClient.ensureQueryData(rulesetQueryOptions(id)),
        context.queryClient.ensureQueryData(archivPreviewQueryOptions(id)),
      ]);
    }
    return { championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle(loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <ChampionshipDashboard
      championshipId={championship.id}
      championshipName={championship.name}
      completed={championship.completed}
      user={user}
    />
  );
}
