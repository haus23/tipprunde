import { useSuspenseQuery } from "@tanstack/react-query";

import { SpieleRoundItem } from "#/components/spiele-round-item.tsx";
import { roundsQueryOptions } from "#/lib/spiele.ts";

export function SpieleView({
  championshipId,
  championshipName,
}: {
  championshipId: number;
  championshipName: string;
}) {
  const {
    data: { rounds },
  } = useSuspenseQuery(roundsQueryOptions(championshipId));

  const lastResultIndex = rounds.findLastIndex((r) => r.matches.some((m) => m.result !== null));
  const defaultOpenIndex = lastResultIndex >= 0 ? lastResultIndex : 0;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
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
