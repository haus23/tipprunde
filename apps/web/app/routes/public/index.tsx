import { getArchivPreview } from "#/lib/archiv.server.ts";
import { publicChampionshipContext, userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";
import { getCurrentMatches } from "#/lib/spiele.server.ts";
import { getRuleset } from "#/lib/spieler.server.ts";

import type { Route } from "./+types/index";
import { ChampionshipArchivPreview } from "./_dashboard/archiv-preview.tsx";
import { ChampionshipCurrentMatches } from "./_dashboard/current-matches.tsx";
import { ChampionshipRegelwerk } from "./_dashboard/regelwerk.tsx";
import { ChampionshipStandings } from "./_dashboard/standings.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(publicChampionshipContext);
  const user = context.get(userContext);

  if (!championship) {
    return {
      championship: null,
      ranking: [],
      matches: [],
      ruleset: null,
      archiv: [],
      userId: user?.id,
    };
  }

  const [ranking, matches, ruleset, archiv] = await Promise.all([
    getRanking(championship.id),
    getCurrentMatches(championship.id),
    getRuleset(championship.id),
    getArchivPreview(championship.id),
  ]);

  return {
    championship: { name: championship.name, completed: championship.completed },
    ranking,
    matches,
    ruleset,
    archiv,
    userId: user?.id,
  };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { championship, ranking, matches, ruleset, archiv, userId } = loaderData;

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <title>runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`${championship.name} · runde.tips`}</title>
      <div className="mb-10 flex flex-col items-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-1 text-lg">{championship.name}</p>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          <ChampionshipStandings
            ranking={ranking}
            completed={championship.completed}
            userId={userId}
          />
          <ChampionshipCurrentMatches matches={matches} completed={championship.completed} />
        </div>
        {ruleset && <ChampionshipRegelwerk ruleset={ruleset} />}
        {archiv.length > 0 && <ChampionshipArchivPreview championships={archiv} />}
      </div>
    </div>
  );
}
