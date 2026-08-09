import { hasExtraQuestions } from "@tipprunde/domain/ranking";

import { db } from "./db.server";

/**
 * Extra questions with every player's answer. Gated solely on the ruleset
 * including extra questions — point publishing (extraQuestionPointsPublished)
 * only affects the ranking, not this view.
 */
export async function getExtraQuestions(championshipId: number) {
  const championship = await db.query.championships.findFirst({
    where: { id: championshipId },
    columns: { id: true },
    with: { ruleset: { columns: { extraQuestionRuleId: true } } },
  });

  if (
    !championship ||
    !hasExtraQuestions({ extraQuestionRuleId: championship.ruleset.extraQuestionRuleId })
  ) {
    return [];
  }

  return db.query.extraQuestions.findMany({
    where: { championshipId },
    orderBy: { id: "asc" },
    columns: { id: true, question: true, description: true, answer: true },
    with: { extraAnswers: { columns: { userId: true, answer: true, points: true } } },
  });
}

export type ExtraQuestion = Awaited<ReturnType<typeof getExtraQuestions>>[number];
