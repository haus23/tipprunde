import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

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
}));
