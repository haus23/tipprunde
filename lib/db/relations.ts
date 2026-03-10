import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

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
  },
}));
