import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { eq, sum } from "drizzle-orm";
import * as v from "valibot";

import { SpielSelect } from "#/components/spiel-select.tsx";
import { SpielTipps } from "#/components/spiel-tipps.tsx";
import { computeRanking } from "#/domain/ranking.ts";
import { formatDate } from "#/utils/format-date.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

export const fetchSpieleFn = createServerFn({ method: "GET" })
  .inputValidator(v.object({ nr: v.optional(v.number()) }))
  .handler(async ({ data }) => {
    const championship = await getLatestPublishedChampionship();

    if (!championship) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="text-subtle text-sm">Noch kein aktives Turnier.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const allRounds = await db.query.rounds.findMany({
      where: { championshipId: championship.id, published: true },
      orderBy: { nr: "asc" },
      with: {
        matches: {
          orderBy: { nr: "asc" },
          with: { hometeam: true, awayteam: true, tips: true },
        },
      },
    });

    const roundIds = allRounds.map((r) => r.id);
    const allMatches = allRounds.flatMap((r) => r.matches);

    if (allMatches.length === 0) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    let targetNr = data.nr;
    if (targetNr === undefined) {
      targetNr = allMatches
        .filter((m) => m.result !== null && m.date !== null)
        .sort((a, b) => b.date!.localeCompare(a.date!))
        .at(0)?.nr;
    }

    if (targetNr === undefined) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const match = await db.query.matches.findFirst({
      where: { roundId: { in: roundIds }, nr: targetNr },
      with: { hometeam: true, awayteam: true, league: true, tips: { with: { user: true } } },
    });

    if (!match) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const selectRounds = allRounds.map((r) => ({
      nr: r.nr,
      matches: r.matches.map((m) => ({
        nr: m.nr,
        paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
        paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
        points: m.result !== null ? m.tips.reduce((sum, t) => sum + (t.points ?? 0), 0) : null,
      })),
    }));

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

    const matchRound = allRounds.find((r) => r.id === match.roundId);
    const tipsPublished = matchRound?.tipsPublished ?? false;

    const rankedTips = ranking
      .map((entry) => {
        const tip = match.tips.find((t) => t.userId === entry.userId);
        return {
          rank: entry.rank,
          userId: entry.userId,
          userName: entry.name,
          tip: tipsPublished ? (tip?.tip ?? null) : null,
          points: tipsPublished ? (tip?.points ?? null) : null,
          joker: tipsPublished ? (tip?.joker ?? null) : null,
        };
      })
      .filter((t) => t.userId !== undefined);

    const paarung = `${match.hometeam?.name ?? "–"} – ${match.awayteam?.name ?? "–"}`;
    const totalPoints = match.result
      ? match.tips.reduce((sum, t) => sum + (t.points ?? 0), 0)
      : null;

    const SpielView = () => (
      <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
        <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
          <SpielSelect rounds={selectRounds} currentNr={match.nr} />
          <p className="text-subtle text-sm">
            {match.date ? formatDate(match.date) : "–"}
            {match.league && ` · ${match.league.name}`}
            {match.result && ` · Ergebnis ${match.result}`}
            {totalPoints !== null && ` · ${totalPoints} Pkt`}
          </p>
        </div>
        <SpielTipps tips={rankedTips} tipsPublished={tipsPublished} />
      </div>
    );

    const Renderable = await renderServerComponent(<SpielView />);
    return { Renderable, title: `${paarung} | ${championship.name}` };
  });
