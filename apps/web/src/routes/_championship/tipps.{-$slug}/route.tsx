import { createFileRoute } from "@tanstack/react-router";

import { pageTitle } from "#/lib/format.ts";
import { rankingQueryOptions, resolvePlayer } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import { playerMatchesQueryOptions } from "#/lib/spieler.ts";

import { SpielerView } from "./-spieler-view.tsx";

export const Route = createFileRoute("/_championship/tipps/{-$slug}")({
  loader: async ({ context, params }) => {
    const championshipId = context.championship?.id;
    if (championshipId === undefined) return;

    const [ranking] = await Promise.all([
      context.queryClient.ensureQueryData(rankingQueryOptions(championshipId)),
      context.queryClient.ensureQueryData(rulesetQueryOptions(championshipId)),
    ]);

    // No redirect: /spieler shows the resolved default player directly.
    const player = resolvePlayer(ranking, params.slug, context.user?.id);
    if (player) {
      await context.queryClient.ensureQueryData(
        playerMatchesQueryOptions(championshipId, player.userId),
      );
    }
    return { playerName: player?.name, championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle(loaderData?.playerName, loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();
  const { slug } = Route.useParams();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <SpielerView
      championshipId={championship.id}
      championshipName={championship.name}
      slug={slug}
      user={user}
    />
  );
}
