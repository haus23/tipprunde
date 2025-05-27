import { createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { users } from '~/database/schema';

export const userInsertSchema = createInsertSchema(users, {
  id: v.optional(
    v.union([v.number(), v.pipe(v.string(), v.transform(Number))]),
  ),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
