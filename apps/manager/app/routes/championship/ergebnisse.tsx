import { db } from "#/lib/db.server.ts";

import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/ergebnisse";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const firstRound = await db.query.rounds.findFirst({
    where: { championshipId: championship.id },
  });
  return { hasRounds: !!firstRound };
}

export default function Ergebnisse({ loaderData }: Route.ComponentProps) {
  const { hasRounds } = loaderData;

  return (
    <div className="p-8">
      <div className="mb-6 flex min-h-9 items-center justify-between">
        <h1 className="text-xl font-semibold">Ergebnisse</h1>
      </div>
      {!hasRounds && (
        <p className="text-subtle mt-8 text-center text-sm">Noch keine Spiele angelegt.</p>
      )}
    </div>
  );
}
