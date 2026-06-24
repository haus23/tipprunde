import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { hasExtraQuestions } from "@tipprunde/domain/ranking";

import { db } from "#/lib/db.server.ts";

const getExtraQuestions = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const championship = await db.query.championships.findFirst({
      where: { id: championshipId },
      columns: { id: true },
      with: { ruleset: { columns: { extraQuestionRuleId: true } } },
    });

    // Gate solely on the ruleset including extra questions — point publishing
    // (extraQuestionPointsPublished) only affects the ranking, not this view.
    if (
      !championship ||
      !hasExtraQuestions({ extraQuestionRuleId: championship.ruleset.extraQuestionRuleId })
    ) {
      return { questions: [] };
    }

    const questions = await db.query.extraQuestions.findMany({
      where: { championshipId },
      orderBy: { id: "asc" },
      columns: { id: true, question: true, description: true, answer: true },
      with: { extraAnswers: { columns: { userId: true, answer: true, points: true } } },
    });
    return { questions };
  });

export type ExtraQuestion = Awaited<ReturnType<typeof getExtraQuestions>>["questions"][number];

export const extraQuestionsQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["extra-questions", championshipId],
    queryFn: () => getExtraQuestions({ data: championshipId }),
  });
