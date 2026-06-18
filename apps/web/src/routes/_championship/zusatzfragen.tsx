import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

import { CellLink } from "#/components/cell-link.tsx";
import { extraQuestionsQueryOptions } from "#/lib/extra-questions.ts";
import type { ExtraQuestion } from "#/lib/extra-questions.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";

export const Route = createFileRoute("/_championship/zusatzfragen")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      return Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(extraQuestionsQueryOptions(id)),
      ]);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <ZusatzfragenView
      championshipId={championship.id}
      championshipName={championship.name}
      pointsPublished={championship.extraQuestionPointsPublished}
    />
  );
}

function ZusatzfragenView({
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

function QuestionBlock({
  question,
  ranking,
  pointsPublished,
}: {
  question: ExtraQuestion;
  ranking: RankedPlayer[];
  pointsPublished: boolean;
}) {
  const answersByUser = new Map(question.extraAnswers.map((a) => [a.userId, a]));

  return (
    <details name="zusatzfragen" className="group border-subtle border-b last:border-b-0">
      <summary className="focus-visible:ring-accent hover:bg-surface-raised xs:px-3 flex cursor-pointer list-none items-start justify-between gap-3 px-2 py-3 transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="text-base font-medium">{question.question}</h2>
          {question.description && <p className="text-subtle text-sm">{question.description}</p>}
          <p className="text-subtle mt-1 text-sm">
            {pointsPublished ? "Richtige Antwort:" : "Aktueller Stand:"}{" "}
            <span className="text-app">{question.answer ?? "noch offen"}</span>
          </p>
        </div>
        <ChevronDownIcon className="text-subtle mt-1 size-4 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" />
      </summary>
      <div className="xs:px-3 px-2 pb-3">
        <table className="w-full text-base">
          <thead>
            <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
              <th className="xs:px-3 px-2 pt-2 pb-3 font-medium">Spieler</th>
              <th className="xs:px-3 px-2 pt-2 pb-3 font-medium">Antwort</th>
              <th className="xs:px-3 w-px px-2 pt-2 pb-3 text-center font-medium">Pkt</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player) => {
              const answer = answersByUser.get(player.userId);
              return (
                <tr key={player.userId} className="border-subtle border-b last:border-b-0">
                  <td className="xs:px-3 px-2 py-3 font-medium">
                    <CellLink to="/tipps/{-$slug}" params={{ slug: player.slug }}>
                      {player.name}
                    </CellLink>
                  </td>
                  <td className="xs:px-3 px-2 py-3">{answer?.answer ?? "–"}</td>
                  <td className="xs:px-3 w-px px-2 py-3 text-center tabular-nums">
                    {answer?.points != null ? answer.points : "–"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
