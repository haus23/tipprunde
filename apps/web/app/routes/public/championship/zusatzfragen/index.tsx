import { viewedChampionshipContext } from "#/lib/context.ts";
import { getExtraQuestions } from "#/lib/extra-questions.server.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/index";
import { QuestionBlock } from "./_question-block.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;

  const [ranking, questions] = await Promise.all([
    getRanking(championship.id),
    getExtraQuestions(championship.id),
  ]);

  return {
    championshipName: championship.name,
    questions,
    ranking,
    pointsPublished: championship.extraQuestionPointsPublished,
  };
}

export default function Zusatzfragen({ loaderData }: Route.ComponentProps) {
  const { championshipName, questions, ranking, pointsPublished } = loaderData;

  // Title and championship name come from the rahmen (_overview-nav.tsx).
  return (
    <div className="mx-auto w-full max-w-3xl">
      <title>{`Zusatzfragen · ${championshipName} · runde.tips`}</title>
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
