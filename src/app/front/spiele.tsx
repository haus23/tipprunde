import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import * as v from "valibot";

import { formatDate } from "#/utils/format-date.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";

export const fetchSpieleFn = createServerFn({ method: "GET" })
  .inputValidator(v.object({ nr: v.optional(v.number()) }))
  .handler(async ({ data }) => {
    const championship = await getLatestPublishedChampionship();

    if (!championship) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="text-subtle text-sm">Noch kein aktives Turnier.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const roundIds = (
      await db.query.rounds.findMany({
        where: { championshipId: championship.id, published: true },
        columns: { id: true },
      })
    ).map((r) => r.id);

    const matchQuery = {
      with: {
        hometeam: true,
        awayteam: true,
        league: true,
        round: true,
        tips: { with: { user: true } },
      },
    } as const;

    const match =
      roundIds.length === 0
        ? null
        : data.nr !== undefined
          ? await db.query.matches.findFirst({
              where: { roundId: { in: roundIds }, nr: data.nr },
              ...matchQuery,
            })
          : await db.query.matches.findFirst({
              where: { roundId: { in: roundIds }, result: { isNotNull: true } },
              orderBy: { date: "desc" },
              ...matchQuery,
            });

    if (!match) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const paarung = `${match.hometeam?.name ?? "–"} – ${match.awayteam?.name ?? "–"}`;
    const totalPoints = match.result
      ? match.tips.reduce((sum, t) => sum + (t.points ?? 0), 0)
      : null;

    const SpielView = () => (
      <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
        <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
          <h1 className="text-2xl font-semibold tracking-tight">{paarung}</h1>
          <p className="text-subtle text-sm">
            {match.date ? formatDate(match.date) : "–"}
            {match.league && ` · ${match.league.name}`}
            {match.result && ` · Ergebnis ${match.result}`}
            {totalPoints !== null && ` · ${totalPoints} Pkt`}
          </p>
        </div>
      </div>
    );

    const Renderable = await renderServerComponent(<SpielView />);
    return { Renderable, title: `${paarung} | ${championship.name}` };
  });
