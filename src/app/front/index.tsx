import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { eq, sum } from "drizzle-orm";

import { Card } from "#/components/card.tsx";
import { computeRanking } from "#/domain/ranking.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export const fetchIndexFn = createServerFn({ method: "GET" }).handler(async () => {
  const championship = await getLatestPublishedChampionship();

  if (!championship) {
    const Renderable = await renderServerComponent(
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-4 text-sm">Noch kein aktives Turnier.</p>
      </div>,
    );
    return { Renderable };
  }

  // Ranking — top 3
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
    points: Number(pointRows.find((r) => r.userId === p.userId)?.points ?? 0),
  }));
  const top3 = computeRanking(playerPoints)
    .map((entry) => ({
      ...entry,
      name: playerPoints.find((p) => p.userId === entry.userId)!.name,
    }))
    .slice(0, 3);

  // Aktuelle Spiele
  const roundIds = (
    await db.query.rounds.findMany({
      where: { championshipId: championship.id },
      columns: { id: true },
    })
  ).map((r) => r.id);

  const datedMatches =
    roundIds.length > 0
      ? await db.query.matches.findMany({
          where: { roundId: { in: roundIds }, date: { isNotNull: true } },
          with: { hometeam: true, awayteam: true },
          orderBy: { date: "asc" },
        })
      : [];

  const today = new Date().toISOString().slice(0, 10);
  let anchorIndex = -1;
  for (let i = datedMatches.length - 1; i >= 0; i--) {
    if (datedMatches[i].date! <= today) {
      anchorIndex = i;
      break;
    }
  }
  if (anchorIndex === -1) anchorIndex = 0;
  const currentMatches = datedMatches.slice(Math.max(0, anchorIndex - 1), anchorIndex + 3);

  const IndexView = () => (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-10 text-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:row-span-2">
          <Card title="Tabelle">
            {top3.length === 0 ? (
              <p className="text-subtle text-sm">Noch keine Tipps gewertet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {top3.map((entry, index) => (
                    <tr key={entry.userId} className="border-input border-b last:border-b-0">
                      <td className="w-px py-2 pr-3 text-right tabular-nums">
                        {index === 0 || top3[index - 1].rank !== entry.rank ? entry.rank : ""}
                      </td>
                      <td className="py-2">{entry.name}</td>
                      <td className="py-2 text-right font-medium tabular-nums">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <Card title="Aktuelle Spiele">
          {currentMatches.length === 0 ? (
            <p className="text-subtle text-sm">Keine Spiele verfügbar.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {currentMatches.map((match) => (
                <li key={match.id} className="flex items-center justify-between gap-2">
                  <span className="text-subtle shrink-0 text-xs">{formatDate(match.date!)}</span>
                  <span className="min-w-0 truncate text-center">
                    <span className="hidden sm:inline">
                      {match.hometeam?.name ?? "—"} – {match.awayteam?.name ?? "—"}
                    </span>
                    <span className="sm:hidden">
                      {match.hometeam?.shortName ?? "—"} – {match.awayteam?.shortName ?? "—"}
                    </span>
                  </span>
                  <span className="text-subtle shrink-0 tabular-nums">{match.result ?? "–:–"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Regelwerk">
          <p className="text-subtle text-sm">{championship.ruleset?.description}</p>
        </Card>
      </div>
    </div>
  );

  const Renderable = await renderServerComponent(<IndexView />);
  return { Renderable };
});
