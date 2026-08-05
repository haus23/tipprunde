import { publicChampionshipContext } from "#/lib/context.ts";
import { getExtraQuestions } from "#/lib/extra-questions.server.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/index";
import { QuestionBlock } from "./question-block.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(publicChampionshipContext);
  if (!championship) {
    return { championshipName: null, questions: [], ranking: [], pointsPublished: false };
  }

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

  if (!championshipName) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <title>Zusatzfragen · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <title>{`Zusatzfragen · ${championshipName} · runde.tips`}</title>
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
