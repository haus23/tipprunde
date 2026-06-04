import { db } from "#/lib/db.server.ts";

import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/tipps";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const [firstPlayer, firstRound] = await Promise.all([
    db.query.players.findFirst({ where: { championshipId: championship.id } }),
    db.query.rounds.findFirst({ where: { championshipId: championship.id } }),
  ]);
  return {
    hasPlayers: !!firstPlayer,
    hasRounds: !!firstRound,
    championshipName: championship.name,
  };
}

export default function Tipps({ loaderData }: Route.ComponentProps) {
  const { hasPlayers, hasRounds, championshipName } = loaderData;

  const emptyMessage = !hasPlayers
    ? "Noch keine Spieler im Turnier."
    : !hasRounds
      ? "Noch keine Spiele angelegt."
      : null;

  return (
    <div className="p-8">
      <title>{`Tipps | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center justify-between">
        <h1 className="text-xl font-semibold">Tipps</h1>
      </div>
      {emptyMessage && <p className="text-subtle mt-8 text-center text-sm">{emptyMessage}</p>}
    </div>
  );
}
