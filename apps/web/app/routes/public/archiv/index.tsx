import { AppLink } from "#/components/app-link.tsx";
import { getArchivChampionshipList, getEwigeTabelle } from "#/lib/archiv.server.ts";

import type { Route } from "./+types/index";

export async function loader(_: Route.LoaderArgs) {
  const [championships, entries] = await Promise.all([
    getArchivChampionshipList(),
    getEwigeTabelle(),
  ]);

  return { championships, entries };
}

export default function Archiv({ loaderData }: Route.ComponentProps) {
  const { championships, entries } = loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>Archiv · runde.tips</title>
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Archiv</h1>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <section>
          <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">Turniere</h2>
          {championships.length === 0 ? (
            <p className="text-subtle text-base">Noch keine Turniere.</p>
          ) : (
            <table className="w-full text-base">
              <thead>
                <tr className="text-muted border-subtle border-b text-xs tracking-wide uppercase">
                  <th className="pb-1.5 text-left font-medium">Turnier</th>
                  <th className="pr-3 pb-1.5 text-left font-medium">Sieger</th>
                  <th className="pb-1.5 text-right font-medium">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {championships.map((entry) => (
                  <tr key={entry.slug} className="border-subtle border-b last:border-b-0">
                    <td className="text-subtle py-2 pr-3 text-sm">
                      <AppLink href={`/archiv/${entry.slug}`}>{entry.name}</AppLink>
                    </td>
                    <td className="py-2 pr-3">
                      {entry.completed ? (
                        entry.winners.map((w, i) => (
                          <span key={w.slug}>
                            {i > 0 && ", "}
                            {w.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-subtle italic">(laufend)</span>
                      )}
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
                <tr className="text-muted border-subtle border-b text-xs tracking-wide uppercase">
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
