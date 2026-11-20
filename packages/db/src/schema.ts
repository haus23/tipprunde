import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").unique(),
  role: text("role", { enum: ["user", "manager", "admin"] })
    .notNull()
    .default("user"),
  // Trusted player: may enter a match result before a manager does (first in
  // wins, pending until a manager or admin approves). A permission on top of
  // the role, not a role — see docs/decisions/15-player-self-service.md.
  canEnterResults: integer("can_enter_results", { mode: "boolean" }).notNull().default(false),
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
  // Raw User-Agent header at login, parsed only for display (the player's
  // own session list). Null for sessions from before the column existed.
  userAgent: text("user_agent"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const loginCodes = sqliteTable("login_codes", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
});

/**
 * Everything that happens around signing in, successes included.
 *
 * Deliberately no IP addresses: the app sits behind a proxy, the addresses
 * would be of little use without a lookup service, and they are the one field
 * here that turns a log into personal data worth protecting. What is left is
 * enough to answer the questions that actually come up — who got in, who kept
 * failing, and whether an address nobody knows is being tried repeatedly.
 *
 * `email` is stored even when no user matches: on a login attempt with an
 * unknown address, that string is the only thing there is to record.
 *
 * Rows expire after 90 days (see `pruneAuthEvents`).
 */
export const authEvents = sqliteTable(
  "auth_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", {
      enum: [
        "code_requested",
        "unknown_email",
        "request_failed",
        "login_succeeded",
        "code_invalid",
        "code_expired",
        "code_max_attempts",
        "sessions_revoked",
      ],
    }).notNull(),
    /** Null when no user matched, and again once a user is deleted. */
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    email: text("email"),
    /** Free text for the cases that need one — a mail error, who revoked what. */
    detail: text("detail"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  // Every read is "the recent ones", newest first, so the index carries the
  // order too — the alert query and the overview both ride on it.
  (table) => [index("auth_events_created_at_idx").on(table.createdAt)],
);

export type AuthEventType = (typeof authEvents.$inferSelect)["type"];

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
  extraQuestionPointsPublished: integer("extra_question_points_published", { mode: "boolean" })
    .notNull()
    .default(false),
  // Who ran the championship (the "Turnierleitung"). Required by the app, but
  // nullable here: SQLite adds a referencing column only as nullable, and
  // making it NOT NULL later would rebuild the whole table. The migration
  // that added it filled every existing championship.
  leaderId: integer("leader_id").references(() => users.id),
});

export const rounds = sqliteTable(
  "rounds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    championshipId: integer("championship_id")
      .notNull()
      .references(() => championships.id),
    nr: integer("nr").notNull(),
    published: integer("published", { mode: "boolean" }).notNull().default(false),
    tipsPublished: integer("tips_published", { mode: "boolean" }).notNull().default(false),
    completed: integer("completed", { mode: "boolean" }),
    isDoubleRound: integer("is_double_round", { mode: "boolean" }),
    // When the round starts, as a UTC ISO string — players may tip until
    // then. Null means nobody can tip it themselves, which also keeps the
    // legacy championships still being imported closed.
    startsAt: text("starts_at"),
  },
  (table) => [unique().on(table.championshipId, table.nr)],
);

export const matches = sqliteTable(
  "matches",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    roundId: integer("round_id")
      .notNull()
      .references(() => rounds.id),
    nr: integer("nr").notNull(),
    date: text("date"),
    leagueId: text("league_id").references(() => leagues.id),
    hometeamId: text("hometeam_id").references(() => teams.id),
    awayteamId: text("awayteam_id").references(() => teams.id),
    result: text("result"),
    lowestSumBonus: integer("lowest_sum_bonus", { mode: "boolean" }),
    // A user decision, not a computed value (unlike lowestSumBonus above) — so
    // it is never null, just true/false. Excludes the match from scoring: its
    // tips always score null (see calcTipPoints), which every summation in the
    // app already treats as "contributes nothing". The match itself, its
    // result, and its tips stay otherwise untouched — this is not "did not
    // happen", just "does not count".
    excludedFromScoring: integer("excluded_from_scoring", { mode: "boolean" })
      .notNull()
      .default(false),
    // Who entered the current result, and when (UTC ISO). A result is pending
    // while it has an enterer but no approver; legacy and imported results
    // have neither and count as approved. A manager's own entry sets both.
    resultEnteredBy: integer("result_entered_by").references(() => users.id),
    resultEnteredAt: text("result_entered_at"),
    resultApprovedBy: integer("result_approved_by").references(() => users.id),
  },
  // Without it, every "tips of one championship" join scanned the whole tips
  // table and filtered last — ~45K rows read per query, growing with every
  // imported championship. With it: rounds → matches → tips, ~1K rows.
  (table) => [index("matches_round_id_idx").on(table.roundId)],
);

export const tips = sqliteTable(
  "tips",
  {
    matchId: integer("match_id")
      .notNull()
      .references(() => matches.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    tip: text("tip"),
    points: integer("points"),
    joker: integer("joker", { mode: "boolean" }),
    extraJoker: integer("extra_joker", { mode: "boolean" }),
    // Last change only, by the player or a manager; no history. Null for
    // tips from before the column existed and for imports.
    updatedBy: integer("updated_by").references(() => users.id),
    updatedAt: text("updated_at"),
  },
  (table) => [primaryKey({ columns: [table.matchId, table.userId] })],
);

export const roundPoints = sqliteTable(
  "round_points",
  {
    roundId: integer("round_id")
      .notNull()
      .references(() => rounds.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    points: integer("points").notNull(),
  },
  (table) => [primaryKey({ columns: [table.roundId, table.userId] })],
);

export const extraQuestions = sqliteTable("extra_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  championshipId: integer("championship_id")
    .notNull()
    .references(() => championships.id),
  question: text("question").notNull(),
  description: text("description").notNull(),
  answer: text("answer"),
});

export const extraAnswers = sqliteTable(
  "extra_answers",
  {
    extraQuestionId: integer("extra_question_id")
      .notNull()
      .references(() => extraQuestions.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    answer: text("answer"),
    points: real("points"),
  },
  (table) => [primaryKey({ columns: [table.extraQuestionId, table.userId] })],
);

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
    rank: integer("rank"),
    tipPoints: integer("tip_points"),
    extraQuestionPoints: integer("extra_question_points"),
    roundPoints: integer("round_points"),
    total: integer("total"),
  },
  (table) => [unique().on(table.championshipId, table.userId)],
);
