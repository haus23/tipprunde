import { redirect } from "react-router";

import { db } from "#/lib/db.server.ts";

import { RoundNavigator } from "../../components/round-navigator";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/spiele";

export const handle = { title: "Spiele" };

export async function loader({ params, context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const rounds = await db.query.rounds.findMany({
    where: { championshipId: championship.id },
    columns: { id: true, nr: true },
    orderBy: { nr: "asc" },
  });

  const lastRound = rounds.at(-1);

  if (!lastRound) {
    return {
      rounds,
      currentNr: null,
      slug: championship.slug,
      championshipName: championship.name,
    };
  }

  const requestedNr = params.nr ? Number(params.nr) : null;
  const currentNr = requestedNr ?? lastRound.nr;

  if (!rounds.some((r) => r.nr === currentNr)) {
    throw redirect(`/${championship.slug}/spiele/${lastRound.nr}`);
  }

  return { rounds, currentNr, slug: championship.slug, championshipName: championship.name };
}

export default function Spiele({ loaderData }: Route.ComponentProps) {
  const { rounds, currentNr, slug, championshipName } = loaderData;

  return (
    <div className="p-8">
      <title>{`Spiele | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center">
        {currentNr !== null && (
          <RoundNavigator rounds={rounds} currentNr={currentNr} base={`/${slug}/spiele`} />
        )}
      </div>

      {rounds.length === 0 && (
        <p className="text-subtle text-center text-sm">Noch keine Runden angelegt.</p>
      )}

      {/* Match list for currentNr goes here */}
    </div>
  );
}
