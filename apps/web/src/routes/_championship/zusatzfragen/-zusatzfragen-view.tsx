import { useSuspenseQuery } from "@tanstack/react-query";

import { extraQuestionsQueryOptions } from "#/lib/extra-questions.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";

import { QuestionBlock } from "./-question-block.tsx";

export function ZusatzfragenView({
  championshipId,
  championshipName,
  pointsPublished,
}: {
  championshipId: number;
  championshipName: string;
  pointsPublished: boolean;
}) {
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championshipId));
  const {
    data: { questions },
  } = useSuspenseQuery(extraQuestionsQueryOptions(championshipId));

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Zusatzfragen</h1>
        <p className="text-subtle text-sm">{championshipName}</p>
      </div>

      {questions.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">
          Keine Zusatzfragen für dieses Turnier.
        </p>
      ) : (
        <div className="border-subtle border-t">
          {questions.map((question) => (
            <QuestionBlock
              key={question.id}
              question={question}
              ranking={ranking}
              pointsPublished={pointsPublished}
            />
          ))}
        </div>
      )}
    </div>
  );
}
