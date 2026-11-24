import { useId } from "react";

import { AppLink } from "#/components/app-link.tsx";
import { useScopedPath } from "#/components/championship-scope.tsx";
import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import type { CurrentMatch } from "#/lib/spiele.server.ts";
import { formatDate } from "#/lib/utils.ts";

export function ChampionshipCurrentMatches({
  matches,
  completed,
}: {
  matches: CurrentMatch[];
  completed: boolean;
}) {
  const scoped = useScopedPath();
  const headingId = useId();
  return (
    <section className="flex flex-col">
      <SectionHeading id={headingId}>
        {completed ? "Letzte Spiele" : "Aktuelle Spiele"}
      </SectionHeading>
      {matches.length === 0 ? (
        <p className="text-subtle text-base">Noch keine Spiele.</p>
      ) : (
        <table aria-labelledby={headingId} className="w-full text-base">
          {/* Column names for screen readers only, as in the standings. */}
          <thead>
            <tr>
              <th scope="col" className="p-0">
                <span className="sr-only">Datum</span>
              </th>
              <th scope="col" className="p-0">
                <span className="sr-only">Spiel</span>
              </th>
              <th scope="col" className="p-0">
                <span className="sr-only">Ergebnis</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.nr} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle w-px py-2 pr-3 text-xs whitespace-nowrap tabular-nums">
                  {match.date ? formatDate(match.date) : "–"}
                </td>
                <td className="py-2">
                  <AppLink href={scoped(`/spiele/${match.nr}`)}>
                    <span className="hidden lg:inline">{match.paarung}</span>
                    <span className="lg:hidden">{match.paarungShort}</span>
                  </AppLink>
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
        <SectionLink to={scoped("/spiele")}>Komplette Übersicht →</SectionLink>
      </div>
    </section>
  );
}
