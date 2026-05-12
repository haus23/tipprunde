import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
