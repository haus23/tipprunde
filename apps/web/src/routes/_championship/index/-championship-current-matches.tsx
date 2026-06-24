import { CellLink } from "#/components/cell-link.tsx";
import { formatDate } from "#/lib/format.ts";
import type { CurrentMatch } from "#/lib/spiele.ts";

import { SectionHeading } from "./-section-heading.tsx";
import { SectionLink } from "./-section-link.tsx";

export function ChampionshipCurrentMatches({
  matches,
  completed,
}: {
  matches: CurrentMatch[];
  completed: boolean;
}) {
  return (
    <section className="flex flex-col">
      <SectionHeading>{completed ? "Letzte Spiele" : "Aktuelle Spiele"}</SectionHeading>
      {matches.length === 0 ? (
        <p className="text-subtle text-base">Noch keine Spiele.</p>
      ) : (
        <table className="w-full text-base">
          <tbody>
            {matches.map((match) => (
              <tr key={match.nr} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle w-px py-2 pr-3 text-xs whitespace-nowrap tabular-nums">
                  {match.date ? formatDate(match.date) : "–"}
                </td>
                <td className="py-2">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    <span className="hidden lg:inline">{match.paarung}</span>
                    <span className="lg:hidden">{match.paarungShort}</span>
                  </CellLink>
                </td>
                <td className="text-subtle w-px py-2 pl-3 text-right tabular-nums">
                  {match.result ?? "–:–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-3 flex justify-end">
        <SectionLink to="/spiele">Komplette Übersicht →</SectionLink>
      </div>
    </section>
  );
}
