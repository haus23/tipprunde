import { cx } from "@tipprunde/ui";

import { getArchivChampionshipList, getEwigeTabelle } from "#/lib/archiv.server.ts";
import { formatPoints } from "#/lib/utils.ts";

import type { Route } from "./+types/index";
import { TournamentList } from "./_tournament-list.tsx";

export async function loader() {
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
        <h1 className="poster-title poster-title-bar text-4xl">Archiv</h1>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <section>
          <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Turniere und Sieger
          </h2>
          {championships.length === 0 ? (
            <p className="text-subtle text-base">Noch keine Turniere.</p>
          ) : (
            <TournamentList championships={championships} />
          )}
        </section>

        <section>
          <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Ewige Tabelle
          </h2>
          {entries.length === 0 ? (
            <p className="text-subtle text-base">Keine Daten.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="text-muted border-subtle border-b text-xs tracking-wide uppercase">
                    <th className="xs:pr-3 w-px pr-2 pb-1.5 text-right font-medium">Platz</th>
                    <th className="xs:pl-3 pb-1.5 pl-2 text-left font-medium">Spieler</th>
                    <th className="xs:px-3 w-px px-2 pb-1.5 text-center font-medium">Turniere</th>
                    <th className="xs:px-3 w-px px-2 pb-1.5 text-center font-medium">Siege</th>
                    <th className="xs:pl-3 w-px pb-1.5 pl-2 text-right font-medium">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => {
                    const sharesRankAbove = i > 0 && entries[i - 1].rank === entry.rank;
                    return (
                      <tr key={entry.userId} className="border-subtle border-b last:border-b-0">
                        {/* Same display digits and podium colors as the ranking table. */}
                        <td
                          className={cx(
                            "font-display xs:pr-3 w-px py-2 pr-2 text-right text-xl leading-none tracking-wider tabular-nums",
                            entry.rank <= 3 ? "text-accent" : "text-subtle",
                          )}
                        >
                          {sharesRankAbove ? "" : entry.rank}
                        </td>
                        <td className="xs:pl-3 py-2 pl-2">{entry.name}</td>
                        <td className="text-subtle xs:px-3 w-px px-2 py-2 text-center tabular-nums">
                          {entry.played}
                        </td>
                        <td className="text-subtle xs:px-3 w-px px-2 py-2 text-center tabular-nums">
                          {entry.wins > 0 ? entry.wins : ""}
                        </td>
                        <td className="font-display xs:pl-3 w-px py-2 pl-2 text-right text-xl leading-none tracking-wider tabular-nums">
                          {formatPoints(entry.totalPoints)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
