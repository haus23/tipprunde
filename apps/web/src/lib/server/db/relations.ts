import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  championships: {
    rulesets: r.one.rulesets({
      from: r.championships.rulesetId,
      to: r.rulesets.id,
    }),
  },
  players: {
    user: r.one.users({
      from: r.players.userId,
      to: r.users.id,
    }),
  },
  matches: {
    round: r.one.rounds({
      from: r.matches.roundId,
      to: r.rounds.id,
    }),
    hometeam: r.one.teams({
      from: r.matches.hometeamId,
      to: r.teams.id,
    }),
    awayteam: r.one.teams({
      from: r.matches.awayteamId,
      to: r.teams.id,
    }),
  },
}));
