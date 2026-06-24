import { createFileRoute } from "@tanstack/react-router";

import { pageTitle } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { matchQueryOptions, roundsQueryOptions } from "#/lib/spiele.ts";

import { MatchView } from "./-match-view.tsx";

export const Route = createFileRoute("/_championship/spiele/$nr")({
  loader: async ({ context, params }) => {
    const id = context.championship?.id;
    const nr = Number(params.nr);
    if (id !== undefined && Number.isInteger(nr)) {
      await Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(roundsQueryOptions(id)),
        context.queryClient.ensureQueryData(matchQueryOptions(id, nr)),
      ]);
    }
    return { championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle("Spiele", loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();
  const { nr } = Route.useParams();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <MatchView championshipId={championship.id} nr={Number(nr)} />;
}
