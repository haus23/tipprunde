import { Link } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import { userContext, viewedChampionshipContext } from "#/lib/context.ts";
import { getVerlauf } from "#/lib/verlauf.server.ts";

import type { Route } from "./+types/index";
import { BumpChart } from "./_bump-chart.tsx";

export async function loader({ context, params }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext);
  const user = context.get(userContext);

  if (!championship) return { championship: null, verlauf: null, focusSlug: undefined };

  const verlauf = await getVerlauf(championship.id);

  // The slug is a focus hint, not a resource: an unknown one simply falls
  // through to the logged-in player, then to the leader (players[0]).
  const focusSlug =
    verlauf.players.find((p) => p.slug === params.playerSlug)?.slug ??
    verlauf.players.find((p) => p.userId === user?.id)?.slug ??
    verlauf.players[0]?.slug;

  return {
    championship: { name: championship.name, completed: championship.completed },
    verlauf,
    focusSlug,
  };
}

export default function Verlauf({ loaderData }: Route.ComponentProps) {
  const { championship, verlauf, focusSlug } = loaderData;
  const scoped = useScopedPath();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <title>Punkteverlauf · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  const hasData = verlauf !== null && verlauf.playedSteps > 0 && verlauf.players.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <title>{`Punkteverlauf · ${championship.name} · runde.tips`}</title>
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link
            to={scoped("/tabelle")}
            prefetch="intent"
            className="text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
          >
            {championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
          </Link>
          <span className="font-medium">Punkteverlauf</span>
        </div>
      </div>

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
