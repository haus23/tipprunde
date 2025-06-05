import { createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { leagues, teams, users } from '~/database/schema';

export const userInsertSchema = createInsertSchema(users, {
  id: v.optional(
    v.union([
      v.undefined(),
      v.number(),
      v.pipe(
        v.string(),
        v.transform((value) => (value === '' ? undefined : Number(value))),
      ),
    ]),
  ),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const teamInsertSchema = createInsertSchema(teams, {
  id: v.optional(
    v.union([
      v.undefined(),
      v.number(),
      v.pipe(
        v.string(),
        v.transform((value) => (value === '' ? undefined : Number(value))),
      ),
    ]),
  ),
});

export type Team = typeof teams.$inferSelect;
export type TeamInsert = Omit<
  typeof teams.$inferInsert,
  'createdAt' | 'updatedAt'
>;

export const leagueInsertSchema = createInsertSchema(leagues, {
  id: v.optional(
    v.union([
      v.undefined(),
      v.number(),
      v.pipe(
        v.string(),
        v.transform((value) => (value === '' ? undefined : Number(value))),
      ),
    ]),
  ),
});

export type League = typeof leagues.$inferSelect;
export type LeagueInsert = Omit<
  typeof leagues.$inferInsert,
  'createdAt' | 'updatedAt'
>;
