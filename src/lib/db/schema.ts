import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").unique(),
  role: text("role", { enum: ["user", "manager", "admin"] })
    .notNull()
    .default("user"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rememberMe: integer("remember_me", { mode: "boolean" }).notNull().default(false),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const totpCodes = sqliteTable("totp_codes", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
});

export const teams = sqliteTable("teams", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
});

export const leagues = sqliteTable("leagues", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
});

export const rulesets = sqliteTable("rulesets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tipRuleId: text("tip_rule_id").notNull(),
  jokerRuleId: text("joker_rule_id").notNull(),
  matchRuleId: text("match_rule_id").notNull(),
  roundRuleId: text("round_rule_id").notNull(),
  extraQuestionRuleId: text("extra_question_rule_id").notNull(),
});

export const championships = sqliteTable("championships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nr: integer("nr").notNull().unique(),
  rulesetId: text("ruleset_id")
    .notNull()
    .references(() => rulesets.id),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  extraQuestionsPublished: integer("extra_questions_published", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const players = sqliteTable(
  "players",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    championshipId: integer("championship_id")
      .notNull()
      .references(() => championships.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    nr: integer("nr").notNull(),
  },
  (table) => ({
    uniq: unique().on(table.championshipId, table.userId),
  }),
);
