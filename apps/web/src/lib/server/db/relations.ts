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
}));
