import {
  leagues as leaguesTable,
  matches as matchesTable,
  players as playersTable,
  rounds as roundsTable,
  teams as teamsTable,
  tips as tipsTable,
} from "@tipprunde/db/schema";
import { calcTipPoints, type TipRuleId } from "@tipprunde/domain/scoring";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/valibot";
import * as v from "valibot";

import type { Championship } from "#/lib/context.ts";

import { db } from "./db.server";
import { updateRanking } from "./ranking.server";

// --- Schema ---
//
// Mirrors the legacy-import JSON built outside the repo (see
// project_legacy_import.md) — one championship at a time, master-data
// additions bundled with the championship-scoped rounds/matches/tips.
// References are stable IDs/numbers throughout, never raw DB foreign keys:
// `roundNr` instead of `roundId`, `matchNr` instead of `matchId`,
// `playerSlug` instead of `userId` — none of those rows exist yet when this
// JSON was written, only once the import actually runs.

const trimmedNonEmpty = (schema: v.GenericSchema<string>) => v.pipe(schema, v.trim(), v.nonEmpty());

const newTeamSchema = createInsertSchema(teamsTable, {
  id: trimmedNonEmpty,
  name: trimmedNonEmpty,
  shortName: trimmedNonEmpty,
});

const newLeagueSchema = createInsertSchema(leaguesTable, {
  id: trimmedNonEmpty,
  name: trimmedNonEmpty,
  shortName: trimmedNonEmpty,
});

const matchSchema = v.object({
  nr: v.number(),
  roundNr: v.number(),
  date: v.nullable(v.string()),
  leagueId: v.string(),
  hometeamId: v.string(),
  awayteamId: v.string(),
  result: v.nullable(v.string()),
  lowestSumBonus: v.nullable(v.boolean()),
});

const tipSchema = v.object({
  matchNr: v.number(),
  playerSlug: v.string(),
  tip: v.string(),
  joker: v.nullable(v.boolean()),
  extraJoker: v.nullable(v.boolean()),
  points: v.nullable(v.number()),
});

export const importSchema = v.object({
  championshipSlug: v.string(),
  newTeams: v.array(newTeamSchema),
  newLeagues: v.array(newLeagueSchema),
  players: v.array(v.string()),
  matches: v.array(matchSchema),
  tips: v.array(tipSchema),
});

export type ImportPayload = v.InferOutput<typeof importSchema>;

export type ImportSummary = {
  teams: number;
  leagues: number;
  players: number;
  matches: number;
  tips: number;
};

// --- Import ---

/**
 * Writes one championship's legacy-import JSON. Upserts throughout — safe to
 * run the same JSON again after a correction. Points are never taken from
 * the JSON; always recomputed via calcTipPoints, same as every other write
 * path in the app.
 *
 * Everything happens in one transaction: any failure rolls back completely,
 * never a partial import.
 */
export async function importLegacyData(
  championship: Championship,
  payload: ImportPayload,
): Promise<ImportSummary> {
  if (payload.championshipSlug !== championship.slug) {
    throw new Error(
      `JSON ist für Championship "${payload.championshipSlug}", diese Seite ist "${championship.slug}".`,
    );
  }

  const ruleset = await db.query.rulesets.findFirst({
    where: { id: championship.rulesetId },
    columns: { tipRuleId: true },
  });
  if (!ruleset) throw new Error("Regelwerk der Championship nicht gefunden.");
  const tipRuleId = ruleset.tipRuleId as TipRuleId;

  const summary: ImportSummary = { teams: 0, leagues: 0, players: 0, matches: 0, tips: 0 };

  await db.transaction(async (tx) => {
    for (const team of payload.newTeams) {
      await tx
        .insert(teamsTable)
        .values(team)
        .onConflictDoUpdate({
          target: teamsTable.id,
          set: { name: team.name, shortName: team.shortName },
        });
    }
    summary.teams = payload.newTeams.length;

    for (const league of payload.newLeagues) {
      await tx
        .insert(leaguesTable)
        .values(league)
        .onConflictDoUpdate({
          target: leaguesTable.id,
          set: { name: league.name, shortName: league.shortName },
        });
    }
    summary.leagues = payload.newLeagues.length;

    const foundUsers = await tx.query.users.findMany({
      where: { slug: { in: payload.players } },
      columns: { id: true, slug: true },
    });
    const userIdBySlug = new Map(foundUsers.map((u) => [u.slug, u.id]));
    for (const slug of payload.players) {
      const userId = userIdBySlug.get(slug);
      if (!userId) throw new Error(`Unbekannter Spieler-Slug: "${slug}"`);
      await tx
        .insert(playersTable)
        .values({ championshipId: championship.id, userId })
        .onConflictDoNothing();
    }
    summary.players = payload.players.length;

    // Rounds: one per distinct roundNr seen in matches — find or create,
    // caching id + isDoubleRound (needed for scoring below) per nr.
    const roundNrs = [...new Set(payload.matches.map((m) => m.roundNr))].sort((a, b) => a - b);
    const roundByNr = new Map<number, { id: number; isDoubleRound: boolean | null }>();
    for (const nr of roundNrs) {
      const existing = await tx.query.rounds.findFirst({
        where: { championshipId: championship.id, nr },
        columns: { id: true, isDoubleRound: true },
      });
      if (existing) {
        roundByNr.set(nr, existing);
        continue;
      }
      const [inserted] = await tx
        .insert(roundsTable)
        .values({ championshipId: championship.id, nr })
        .returning({ id: roundsTable.id });
      roundByNr.set(nr, { id: inserted!.id, isDoubleRound: null });
    }

    // Matches have no unique constraint to upsert against (nr is only
    // conventionally unique per championship, not enforced) — find, then
    // insert or update.
    const matchIdByNr = new Map<number, number>();
    for (const match of payload.matches) {
      const round = roundByNr.get(match.roundNr);
      if (!round) throw new Error(`Runde ${match.roundNr} nicht gefunden (Spiel ${match.nr}).`);

      const values = {
        roundId: round.id,
        nr: match.nr,
        date: match.date,
        leagueId: match.leagueId,
        hometeamId: match.hometeamId,
        awayteamId: match.awayteamId,
        result: match.result,
        lowestSumBonus: match.lowestSumBonus,
      };

      const existing = await tx.query.matches.findFirst({
        where: { roundId: round.id, nr: match.nr },
        columns: { id: true },
      });
      if (existing) {
        await tx.update(matchesTable).set(values).where(eq(matchesTable.id, existing.id));
        matchIdByNr.set(match.nr, existing.id);
      } else {
        const [inserted] = await tx
          .insert(matchesTable)
          .values(values)
          .returning({ id: matchesTable.id });
        matchIdByNr.set(match.nr, inserted!.id);
      }
    }
    summary.matches = payload.matches.length;

    const matchByNr = new Map(payload.matches.map((m) => [m.nr, m]));
    for (const tip of payload.tips) {
      const matchId = matchIdByNr.get(tip.matchNr);
      if (!matchId) throw new Error(`Unbekannte Spiel-Nr in Tipp: ${tip.matchNr}.`);
      const userId = userIdBySlug.get(tip.playerSlug);
      if (!userId) throw new Error(`Unbekannter Spieler-Slug in Tipp: "${tip.playerSlug}".`);

      const match = matchByNr.get(tip.matchNr)!;
      const isDoubleRound = roundByNr.get(match.roundNr)?.isDoubleRound ?? null;
      const points = calcTipPoints(
        tip.tip,
        match.result,
        tipRuleId,
        isDoubleRound,
        tip.joker,
        tip.extraJoker,
      );

      await tx
        .insert(tipsTable)
        .values({
          matchId,
          userId,
          tip: tip.tip,
          points,
          joker: tip.joker,
          extraJoker: tip.extraJoker,
        })
        .onConflictDoUpdate({
          target: [tipsTable.matchId, tipsTable.userId],
          set: { tip: tip.tip, points, joker: tip.joker, extraJoker: tip.extraJoker },
        });
    }
    summary.tips = payload.tips.length;
  });

  await updateRanking(championship.id);

  return summary;
}
