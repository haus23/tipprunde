import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { RoundAccordion } from "#/components/round-accordion.tsx";
import { formatDate } from "#/lib/format.ts";
import { roundsQueryOptions } from "#/lib/spiele.ts";
import type { SpieleRound } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/spiele")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      return context.queryClient.ensureQueryData(roundsQueryOptions(id));
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <SpieleView championshipId={championship.id} championshipName={championship.name} />;
}

function SpieleView({
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
    <div className="mx-auto w-full max-w-5xl py-8">
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

function SpieleRoundItem({ round, defaultOpen }: { round: SpieleRound; defaultOpen: boolean }) {
  const matchesWithResult = round.matches.filter((m) => m.result !== null).length;
  const totalMatches = round.matches.length;
  const roundSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;

  return (
    <RoundAccordion
      title={`Runde ${round.nr}`}
      defaultOpen={defaultOpen}
      meta={<span className="text-subtle text-xs">{roundSpiele} Sp.</span>}
    >
      <table className="w-full text-base">
        <thead>
          <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-right font-medium">#</th>
            <th className="xs:table-cell hidden w-px px-2 pt-2 pb-3 font-medium">Datum</th>
            <th className="hidden w-px px-2 pt-2 pb-3 font-medium whitespace-nowrap sm:table-cell">
              Liga
            </th>
            <th className="xs:px-2 px-1 pt-2 pb-3 font-medium">Paarung</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Erg.</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-right font-medium">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {round.matches.map((match) => (
            <tr key={match.id} className="border-subtle border-b last:border-b-0">
              <td className="text-subtle xs:px-2 w-px px-1 py-3 text-right tabular-nums">
                {match.nr}
              </td>
              <td className="xs:table-cell hidden w-px px-2 py-3 tabular-nums">
                {match.date ? formatDate(match.date) : "–"}
              </td>
              <td className="text-subtle hidden w-px px-2 py-3 text-xs whitespace-nowrap sm:table-cell">
                {match.liga ?? "–"}
              </td>
              <td className="xs:px-2 px-1 py-3">
                <span className="hidden sm:inline">{match.paarung}</span>
                <span className="sm:hidden">{match.paarungShort}</span>
              </td>
              <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                {match.result ?? "–:–"}
              </td>
              <td className="xs:px-2 w-px px-1 py-3 text-right tabular-nums">
                {match.points ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RoundAccordion>
  );
}
