import { Disclosure } from "@tipprunde/ui";

import { CellLink } from "#/components/cell-link.tsx";
import type { ExtraQuestion } from "#/lib/extra-questions.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";

export function QuestionBlock({
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
    <Disclosure
      name="zusatzfragen"
      title={
        <div className="min-w-0">
          <h2 className="text-base font-medium">{question.question}</h2>
          {question.description && <p className="text-subtle text-sm">{question.description}</p>}
          <p className="text-subtle mt-1 text-sm">
            {pointsPublished ? "Richtige Antwort:" : "Aktueller Stand:"}{" "}
            <span className="text-app">{question.answer ?? "noch offen"}</span>
          </p>
        </div>
      }
      className="border-subtle border-b last:border-b-0"
      summaryClassName="items-start"
    >
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
    </Disclosure>
  );
}
