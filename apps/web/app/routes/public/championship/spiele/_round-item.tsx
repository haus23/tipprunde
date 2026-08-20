import { useMemo } from "react";

import { AppLink } from "#/components/app-link.tsx";
import { useScopedPath } from "#/components/championship-scope.tsx";
import { RoundAccordion } from "#/components/round-accordion.tsx";
import type { SpieleRound } from "#/lib/spiele.server.ts";
import { formatDate } from "#/lib/utils.ts";

export function SpieleRoundItem({
  round,
  defaultOpen,
}: {
  round: SpieleRound;
  defaultOpen: boolean;
}) {
  const scoped = useScopedPath();
  const matchesWithResult = round.matches.filter((m) => m.result !== null).length;
  const totalMatches = round.matches.length;
  const roundSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;
  const meta = useMemo(
    () => <span className="text-subtle text-xs">{roundSpiele} Sp.</span>,
    [roundSpiele],
  );

  return (
    <RoundAccordion title={`Runde ${round.nr}`} defaultOpen={defaultOpen} meta={meta}>
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
                <AppLink href={scoped(`/spiele/${match.nr}`)}>{match.nr}</AppLink>
              </td>
              <td className="xs:table-cell hidden w-px px-2 py-3 tabular-nums">
                {match.date ? formatDate(match.date) : "–"}
              </td>
              <td className="text-subtle hidden w-px px-2 py-3 text-xs whitespace-nowrap sm:table-cell">
                {match.liga ?? "–"}
              </td>
              <td className="xs:px-2 px-1 py-3">
                <AppLink href={scoped(`/spiele/${match.nr}`)}>
                  <span className="hidden sm:inline">{match.paarung}</span>
                  <span className="sm:hidden">{match.paarungShort}</span>
                </AppLink>
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
