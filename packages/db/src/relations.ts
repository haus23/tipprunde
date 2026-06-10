import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  championships: {
    ruleset: r.one.rulesets({
      from: r.championships.rulesetId,
      to: r.rulesets.id,
    }),
    extraQuestions: r.many.extraQuestions({
      from: r.championships.id,
      to: r.extraQuestions.championshipId,
    }),
  },
  extraQuestions: {
    championship: r.one.championships({
      from: r.extraQuestions.championshipId,
      to: r.championships.id,
    }),
    extraAnswers: r.many.extraAnswers({
      from: r.extraQuestions.id,
      to: r.extraAnswers.extraQuestionId,
    }),
  },
  extraAnswers: {
    user: r.one.users({
      from: r.extraAnswers.userId,
      to: r.users.id,
    }),
  },
  rounds: {
    matches: r.many.matches({
      from: r.rounds.id,
      to: r.matches.roundId,
    }),
  },
  players: {
    user: r.one.users({
      from: r.players.userId,
      to: r.users.id,
    }),
  },
  tips: {
    user: r.one.users({
      from: r.tips.userId,
      to: r.users.id,
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
}));
