import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { extraAnswers, extraQuestions, matches, rounds, tips } from "@tipprunde/db/schema";
import { calcRanking, includesExtraQuestions } from "@tipprunde/domain/ranking";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";

const getRanking = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const [championship, players, tipRows, extraRows] = await Promise.all([
      db.query.championships.findFirst({
        where: { id: championshipId },
        columns: { extraQuestionsPublished: true },
        with: { ruleset: { columns: { extraQuestionRuleId: true } } },
      }),
      db.query.players.findMany({
        where: { championshipId },
        columns: { userId: true },
        with: { user: { columns: { name: true, slug: true } } },
        orderBy: { id: "asc" },
      }),
      db
        .select({ userId: tips.userId, points: tips.points })
        .from(tips)
        .innerJoin(matches, eq(tips.matchId, matches.id))
        .innerJoin(rounds, eq(matches.roundId, rounds.id))
        .where(eq(rounds.championshipId, championshipId)),
      db
        .select({ userId: extraAnswers.userId, points: extraAnswers.points })
        .from(extraAnswers)
        .innerJoin(extraQuestions, eq(extraAnswers.extraQuestionId, extraQuestions.id))
        .where(eq(extraQuestions.championshipId, championshipId)),
    ]);

    if (!championship) return { ranking: [], showExtras: false };

    const ruleset = { extraQuestionRuleId: championship.ruleset.extraQuestionRuleId };
    const flags = { extraQuestionsPublished: championship.extraQuestionsPublished };

    const entries = calcRanking({
      players: players.map((p) => ({ userId: p.userId })),
      tips: tipRows,
      extraAnswers: extraRows,
      ruleset,
      championship: flags,
    });

    const userById = new Map(players.map((p) => [p.userId, p.user]));
    const ranking = entries.map((e) => ({
      ...e,
      name: userById.get(e.userId)?.name ?? "",
      slug: userById.get(e.userId)?.slug ?? "",
    }));

    return { ranking, showExtras: includesExtraQuestions(ruleset, flags) };
  });

export const Route = createFileRoute("/_championship/tabelle")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    return id ? getRanking({ data: id }) : { ranking: [], showExtras: false };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();
  const { ranking, showExtras } = Route.useLoaderData();

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{championship?.name}</h1>
        <p className="text-subtle text-sm">
          {championship?.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
        </p>
      </div>

      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-sm">Noch keine Platzierungen.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-muted text-xs tracking-wide uppercase">
              <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-right font-medium">
                Platz
              </th>
              <th className="border-subtle xs:px-3 xs:py-2.5 border-b px-2 py-2 text-left font-medium">
                Spieler
              </th>
              {showExtras && (
                <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
                  <span className="xs:inline hidden">Zusatzpunkte</span>
                  <span className="xs:hidden">Zusatzpkt.</span>
                </th>
              )}
              <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
                {showExtras ? (
                  <>
                    <span className="xs:inline hidden">Gesamtpunkte</span>
                    <span className="xs:hidden">Gesamt</span>
                  </>
                ) : (
                  "Punkte"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((entry, index) => {
              const isCurrentUser = user?.id === entry.userId;
              const sharesRankAbove = index > 0 && ranking[index - 1].rank === entry.rank;
              return (
                <tr
                  key={entry.userId}
                  className={`border-subtle border-b transition-colors last:border-0 ${
                    isCurrentUser ? "bg-accent-subtle" : "hover:bg-surface-raised"
                  }`}
                >
                  <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-right tabular-nums">
                    {sharesRankAbove ? "" : entry.rank}
                  </td>
                  <td className={`xs:px-3 xs:py-3 px-2 py-2 ${isCurrentUser ? "font-medium" : ""}`}>
                    {entry.name}
                  </td>
                  {showExtras && (
                    <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-center tabular-nums">
                      {entry.extraPoints}
                    </td>
                  )}
                  <td className="xs:px-3 xs:py-3 px-2 py-2 text-center font-medium tabular-nums">
                    {entry.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
