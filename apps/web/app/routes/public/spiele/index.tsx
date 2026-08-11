import { publicChampionshipContext } from "#/lib/context.ts";
import { getRounds } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/index";
import { SpieleRoundItem } from "./_round-item.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(publicChampionshipContext);
  if (!championship) return { championshipName: null, rounds: [] };

  return { championshipName: championship.name, rounds: await getRounds(championship.id) };
}

export default function Spiele({ loaderData }: Route.ComponentProps) {
  const { championshipName, rounds } = loaderData;

  if (!championshipName) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <title>Spiele · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  // Open the most recently played round rather than the first.
  const lastResultIndex = rounds.findLastIndex((r) => r.matches.some((m) => m.result !== null));
  const defaultOpenIndex = lastResultIndex >= 0 ? lastResultIndex : 0;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`Spiele · ${championshipName} · runde.tips`}</title>
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Spielübersicht</h1>
        <p className="text-subtle text-sm">{championshipName}</p>
      </div>

      {rounds.length === 0 ? (
        <p className="text-subtle px-4 text-base">Noch keine Runden gespielt.</p>
      ) : (
        <div className="border-subtle border-t">
          {rounds.map((round, i) => (
            <SpieleRoundItem key={round.nr} round={round} defaultOpen={i === defaultOpenIndex} />
          ))}
        </div>
      )}
    </div>
  );
}
