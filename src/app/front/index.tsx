import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { eq, sum } from "drizzle-orm";

import { fetchUser } from "#/app/(auth)/session.ts";
import { Card } from "#/components/card.tsx";
import { computeRanking } from "#/domain/ranking.ts";
import { RULE_CATEGORIES } from "#/domain/rules.ts";
import { formatDate } from "#/utils/format-date.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

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

  // Ranking
  const [allPlayers, currentUser] = await Promise.all([getPlayers(championship.id), fetchUser()]);
  const pointRows = await db
    .select({ userId: tips.userId, points: sum(tips.points) })
    .from(tips)
    .innerJoin(matches, eq(tips.matchId, matches.id))
    .innerJoin(rounds, eq(matches.roundId, rounds.id))
    .where(eq(rounds.championshipId, championship.id))
    .groupBy(tips.userId);

  const playerPoints = allPlayers.map((p) => ({
    userId: p.userId,
    slug: p.user?.slug ?? "",
    name: p.user?.name ?? "",
    points: Number(pointRows.find((r) => r.userId === p.userId)?.points ?? 0),
  }));

  const fullRanking = computeRanking(playerPoints).map((entry) => {
    const player = playerPoints.find((p) => p.userId === entry.userId)!;
    return { ...entry, name: player.name, slug: player.slug };
  });

  const top3 = fullRanking.slice(0, 3);

  const currentUserEntry = currentUser
    ? (fullRanking.find((e) => e.userId === currentUser.id) ?? null)
    : null;
  const userBelowTop3 =
    currentUserEntry && !top3.includes(currentUserEntry) ? currentUserEntry : null;
  const userIndex = userBelowTop3 ? fullRanking.indexOf(userBelowTop3) : -1;

  // Aktuelle Spiele
  const roundIds = (
    await db.query.rounds.findMany({
      where: { championshipId: championship.id, published: true },
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

  const withResult = datedMatches.filter((m) => m.result !== null);
  const withoutResult = datedMatches.filter((m) => m.result === null);
  const openCount = Math.min(withoutResult.length, 4 - Math.min(withResult.length, 2));
  const closedCount = Math.min(withResult.length, 4 - openCount);
  const currentMatches = [
    ...withResult.slice(withResult.length - closedCount),
    ...withoutResult.slice(0, openCount),
  ].sort((a, b) => a.date!.localeCompare(b.date!));

  const IndexView = () => (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-10 text-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-1 text-lg">{championship.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:row-span-2">
          <Card title={championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}>
            {top3.length === 0 ? (
              <p className="text-subtle text-sm">Noch keine Tipps gewertet.</p>
            ) : (
              <>
                <table className="w-full text-sm">
                  <tbody>
                    {top3.map((entry, index) => (
                      <tr key={entry.userId} className="border-input border-b last:border-b-0">
                        <td className="w-px py-2 pr-3 text-right tabular-nums">
                          {index === 0 || top3[index - 1].rank !== entry.rank ? entry.rank : ""}
                        </td>
                        <td className="py-2">
                          <Link
                            to="/spieler"
                            search={{ name: entry.slug }}
                            className="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          >
                            {entry.name}
                          </Link>
                        </td>
                        <td className="py-2 text-right font-medium tabular-nums">{entry.points}</td>
                      </tr>
                    ))}
                    {userBelowTop3 && (
                      <>
                        {userIndex > 3 && (
                          <tr>
                            <td colSpan={3} className="text-subtle py-1.5 text-center text-xs">
                              ⋮
                            </td>
                          </tr>
                        )}
                        <tr className="border-input border-b last:border-b-0">
                          <td className="w-px py-2 pr-3 text-right tabular-nums">
                            {userBelowTop3.rank}
                          </td>
                          <td className="py-2">
                            <Link
                              to="/spieler"
                              search={{ name: userBelowTop3.slug }}
                              className="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            >
                              {userBelowTop3.name}
                            </Link>
                          </td>
                          <td className="py-2 text-right font-medium tabular-nums">
                            {userBelowTop3.points}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <Link
                  preload="intent"
                  to="/tabelle"
                  className="text-subtle hover:text-foreground mt-3 flex items-center justify-end gap-1 text-xs"
                >
                  Vollständige Tabelle →
                </Link>
              </>
            )}
          </Card>
        </div>

        <Card title="Aktuelle Spiele">
          {currentMatches.length === 0 ? (
            <p className="text-subtle text-sm">Keine Spiele verfügbar.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {currentMatches.map((match) => (
                  <tr key={match.id} className="border-input border-b last:border-b-0">
                    <td className="text-subtle w-px py-2 pr-3 text-xs whitespace-nowrap tabular-nums">
                      {formatDate(match.date!)}
                    </td>
                    <td className="py-2">
                      <Link
                        to="/spiel"
                        search={{ nr: match.nr }}
                        className="focus-visible:ring-focus rounded outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      >
                        <span className="hidden md:inline">
                          {match.hometeam?.name ?? "—"} – {match.awayteam?.name ?? "—"}
                        </span>
                        <span className="md:hidden">
                          {match.hometeam?.shortName ?? "—"} – {match.awayteam?.shortName ?? "—"}
                        </span>
                      </Link>
                    </td>
                    <td className="text-subtle w-px py-2 pl-3 text-right whitespace-nowrap tabular-nums">
                      {match.result ?? "–:–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Regelwerk">
          <div className="flex flex-col gap-3">
            <p className="text-subtle text-sm">{championship.ruleset?.description}</p>
            {RULE_CATEGORIES.map(({ field, label, rules }) => {
              const ruleId = championship.ruleset?.[field];
              if (!ruleId || ruleId === "keine-besonderheiten") return null;
              const rule = rules.find((r) => r.value === ruleId);
              if (!rule) return null;
              return (
                <div key={field}>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-subtle text-sm">{rule.description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );

  const Renderable = await renderServerComponent(<IndexView />);
  return { Renderable };
});
