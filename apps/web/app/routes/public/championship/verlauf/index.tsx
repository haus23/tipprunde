import { userContext, viewedChampionshipContext } from "#/lib/context.ts";
import { getVerlauf } from "#/lib/verlauf.server.ts";

import type { Route } from "./+types/index";
import { BumpChart } from "./_bump-chart.tsx";

export async function loader({ context, params }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const user = context.get(userContext);

  const verlauf = await getVerlauf(championship.id);

  // The slug is a focus hint, not a resource: an unknown one simply falls
  // through to the logged-in player, then to the leader (players[0]).
  const focusSlug =
    verlauf.players.find((p) => p.slug === params.playerSlug)?.slug ??
    verlauf.players.find((p) => p.userId === user?.id)?.slug ??
    verlauf.players[0]?.slug;

  return {
    championshipName: championship.name,
    verlauf,
    focusSlug,
  };
}

export default function Verlauf({ loaderData }: Route.ComponentProps) {
  const { championshipName, verlauf, focusSlug } = loaderData;
  const hasData = verlauf.playedSteps > 0 && verlauf.players.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <title>{`Verlauf · ${championshipName} · runde.tips`}</title>
      {hasData ? (
        <div className="xs:px-2 px-2">
          <BumpChart
            steps={verlauf.steps}
            playedSteps={verlauf.playedSteps}
            players={verlauf.players}
            focusSlug={focusSlug}
          />
        </div>
      ) : (
        <p className="text-subtle py-16 text-center text-base">Noch keine gewerteten Spiele.</p>
      )}
    </div>
  );
}
