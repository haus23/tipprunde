import { db } from "#/lib/db.server.ts";

import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/ergebnisse";

export const handle = { title: "Ergebnisse" };

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const firstRound = await db.query.rounds.findFirst({
    where: { championshipId: championship.id },
  });
  return { hasRounds: !!firstRound, championshipName: championship.name };
}

export default function Ergebnisse({ loaderData }: Route.ComponentProps) {
  const { hasRounds, championshipName } = loaderData;

  return (
    <div className="p-8">
      <title>{`Ergebnisse | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center justify-between" />
      {!hasRounds && (
        <p className="text-subtle mt-8 text-center text-sm">Noch keine Spiele angelegt.</p>
      )}
    </div>
  );
}
