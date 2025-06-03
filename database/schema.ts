import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
};

export const users = sqliteTable('users', {
  id: integer().primaryKey(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull(),
  roles: text().notNull().default(''),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessions = sqliteTable('sessions', {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  expires: integer({ mode: 'boolean' }).notNull(),
  expirationDate: integer({ mode: 'timestamp' }).notNull(),
  userId: integer().notNull(),
  ...timestamps,
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verifications = sqliteTable('verifications', {
  email: text().primaryKey(),
  secret: text().notNull(),
  algorithm: text().notNull(),
  digits: integer().notNull(),
  period: integer().notNull(),
  charSet: text().notNull(),
  expiresAt: integer({ mode: 'timestamp' }).notNull(),
  attempts: integer().notNull().default(0),
  ...timestamps,
});

export const teams = sqliteTable('teams', {
  id: integer().primaryKey(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  shortname: text().notNull(),
  ...timestamps,
});
