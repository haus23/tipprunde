import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { allCompletedChampionshipsQueryOptions, ewigeTabellQueryOptions } from "#/lib/archiv.ts";

export const Route = createFileRoute("/archiv/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(allCompletedChampionshipsQueryOptions),
      context.queryClient.ensureQueryData(ewigeTabellQueryOptions),
    ]),
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: { championships },
  } = useSuspenseQuery(allCompletedChampionshipsQueryOptions);
  const {
    data: { entries },
  } = useSuspenseQuery(ewigeTabellQueryOptions);

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Archiv</h1>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <section>
          <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">Turniere</h2>
          {championships.length === 0 ? (
            <p className="text-subtle text-base">Noch keine abgeschlossenen Turniere.</p>
          ) : (
            <table className="w-full text-base">
              <thead>
                <tr className="text-muted border-subtle border-b text-xs">
                  <th className="pb-1.5 text-left font-medium">Turnier</th>
                  <th className="pr-3 pb-1.5 text-left font-medium">Sieger</th>
                  <th className="pb-1.5 text-right font-medium">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {championships.map((entry) => (
                  <tr key={entry.slug} className="border-subtle border-b last:border-b-0">
                    <td className="text-subtle py-2 pr-3 text-sm">
                      <Link
                        to="/archiv/$slug"
                        params={{ slug: entry.slug }}
                        className="hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
                      >
                        {entry.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      {entry.winners.map((w, i) => (
                        <span key={w.name}>
                          {i > 0 && ", "}
                          {w.name}
                        </span>
                      ))}
                    </td>
                    <td className="py-2 text-right font-medium tabular-nums">
                      {entry.winners[0]?.total ?? "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Ewige Tabelle
          </h2>
          {entries.length === 0 ? (
            <p className="text-subtle text-base">Keine Daten.</p>
          ) : (
            <table className="w-full text-base">
              <thead>
                <tr className="text-muted border-subtle border-b text-xs">
                  <th className="w-px pr-3 pb-1.5 text-right font-medium">Platz</th>
                  <th className="pb-1.5 pl-3 text-left font-medium">Spieler</th>
                  <th className="w-px px-3 pb-1.5 text-center font-medium">Turniere</th>
                  <th className="w-px pb-1.5 pl-3 text-right font-medium">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const sharesRankAbove = i > 0 && entries[i - 1].rank === entry.rank;
                  return (
                    <tr key={entry.userId} className="border-subtle border-b last:border-b-0">
                      <td className="text-subtle w-px py-2 pr-3 text-right tabular-nums">
                        {sharesRankAbove ? "" : entry.rank}
                      </td>
                      <td className="py-2 pl-3">{entry.name}</td>
                      <td className="text-subtle w-px px-3 py-2 text-center tabular-nums">
                        {entry.played}
                      </td>
                      <td className="w-px py-2 pl-3 text-right font-medium tabular-nums">
                        {entry.totalPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
