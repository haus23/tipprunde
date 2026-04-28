import { defineRelations } from "drizzle-orm";

import * as schema from "./tables.ts";

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions({
      from: r.users.id,
      to: r.sessions.userId,
    }),
    totpCodes: r.many.totpCodes({
      from: r.users.id,
      to: r.totpCodes.userId,
    }),
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  totpCodes: {
    user: r.one.users({
      from: r.totpCodes.userId,
      to: r.users.id,
    }),
  },
  rulesets: {
    championships: r.many.championships({
      from: r.rulesets.id,
      to: r.championships.rulesetId,
    }),
  },
  championships: {
    ruleset: r.one.rulesets({
      from: r.championships.rulesetId,
      to: r.rulesets.id,
    }),
    rounds: r.many.rounds({
      from: r.championships.id,
      to: r.rounds.championshipId,
    }),
    players: r.many.players({
      from: r.championships.id,
      to: r.players.championshipId,
    }),
  },
  rounds: {
    championship: r.one.championships({
      from: r.rounds.championshipId,
      to: r.championships.id,
    }),
    matches: r.many.matches({
      from: r.rounds.id,
      to: r.matches.roundId,
    }),
  },
  matches: {
    round: r.one.rounds({
      from: r.matches.roundId,
      to: r.rounds.id,
    }),
    league: r.one.leagues({
      from: r.matches.leagueId,
      to: r.leagues.id,
    }),
    hometeam: r.one.teams({
      from: r.matches.hometeamId,
      to: r.teams.id,
    }),
    awayteam: r.one.teams({
      from: r.matches.awayteamId,
      to: r.teams.id,
    }),
    tips: r.many.tips({
      from: r.matches.id,
      to: r.tips.matchId,
    }),
  },
  tips: {
    match: r.one.matches({
      from: r.tips.matchId,
      to: r.matches.id,
    }),
    user: r.one.users({
      from: r.tips.userId,
      to: r.users.id,
    }),
  },
  players: {
    championship: r.one.championships({
      from: r.players.championshipId,
      to: r.championships.id,
    }),
    user: r.one.users({
      from: r.players.userId,
      to: r.users.id,
    }),
  },
}));
