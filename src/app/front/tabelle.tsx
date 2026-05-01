import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { eq, sum } from "drizzle-orm";

import { computeRanking } from "#/domain/ranking.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

export const fetchTabelleFn = createServerFn({ method: "GET" }).handler(async () => {
  const championship = await getLatestPublishedChampionship();

  if (!championship) {
    const Renderable = await renderServerComponent(
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-subtle text-sm">Noch kein aktives Turnier.</p>
      </div>,
    );
    return { Renderable, title: "Tabelle" };
  }

  const allPlayers = await getPlayers(championship.id);
  const pointRows = await db
    .select({ userId: tips.userId, points: sum(tips.points) })
    .from(tips)
    .innerJoin(matches, eq(tips.matchId, matches.id))
    .innerJoin(rounds, eq(matches.roundId, rounds.id))
    .where(eq(rounds.championshipId, championship.id))
    .groupBy(tips.userId);

  const playerPoints = allPlayers.map((p) => ({
    userId: p.userId,
    name: p.user?.name ?? "",
    slug: p.user?.slug ?? "",
    points: Number(pointRows.find((r) => r.userId === p.userId)?.points ?? 0),
  }));
  const ranking = computeRanking(playerPoints).map((entry) => ({
    ...entry,
    ...playerPoints.find((p) => p.userId === entry.userId)!,
  }));

  const subtitle = championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle";

  const TabelleView = () => (
    <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">{subtitle}</span>
          <Link
            to="/verlauf"
            className="focus-visible:ring-focus text-subtle hover:text-foreground rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Punkteverlauf
          </Link>
        </div>
      </div>
      <div className="bg-surface border-surface xs:rounded-md xs:border border-y px-4 py-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-input border-b text-left">
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-right text-xs font-medium tracking-wide uppercase">
                Platz
              </th>
              <th className="text-subtle px-2 pt-2 pb-3 text-left text-xs font-medium tracking-wide uppercase">
                Spieler
              </th>
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                Punkte
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-subtle px-2 py-6 text-center">
                  Noch keine Tipps gewertet.
                </td>
              </tr>
            ) : (
              ranking.map((entry, index) => (
                <tr key={entry.userId} className="border-input border-b last:border-b-0">
                  <td className="w-px px-2 py-3 text-right tabular-nums">
                    {index === 0 || ranking[index - 1].rank !== entry.rank ? entry.rank : ""}
                  </td>
                  <td className="px-2 py-3 text-left">
                    <Link
                      to="/spieler"
                      search={{ name: entry.slug }}
                      className="hover:text-foreground text-subtle transition-colors"
                    >
                      {entry.name}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-center font-medium tabular-nums">{entry.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Renderable = await renderServerComponent(<TabelleView />);
  return { Renderable, title: `Tabelle | ${championship.name}` };
});
