import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
};

export const verifications = sqliteTable('verifications', {
  email: text().primaryKey().notNull(),
  secret: text().notNull(),
  algorithm: text().notNull(),
  digits: integer().notNull(),
  period: integer().notNull(),
  charSet: text().notNull(),
  expiresAt: integer({ mode: 'timestamp' }).notNull(),
  attempts: integer().notNull().default(0),
  ...timestamps,
});
