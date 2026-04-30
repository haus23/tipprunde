import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import * as v from "valibot";

import { SpielSelect } from "#/components/spiel-select.tsx";
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

    const allRounds = await db.query.rounds.findMany({
      where: { championshipId: championship.id, published: true },
      orderBy: { nr: "asc" },
      with: {
        matches: {
          orderBy: { nr: "asc" },
          with: { hometeam: true, awayteam: true, tips: true },
        },
      },
    });

    const roundIds = allRounds.map((r) => r.id);
    const allMatches = allRounds.flatMap((r) => r.matches);

    if (allMatches.length === 0) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    let targetNr = data.nr;
    if (targetNr === undefined) {
      targetNr = allMatches
        .filter((m) => m.result !== null && m.date !== null)
        .sort((a, b) => b.date!.localeCompare(a.date!))
        .at(0)?.nr;
    }

    if (targetNr === undefined) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const match = await db.query.matches.findFirst({
      where: { roundId: { in: roundIds }, nr: targetNr },
      with: { hometeam: true, awayteam: true, league: true, tips: { with: { user: true } } },
    });

    if (!match) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spiele verfügbar.</p>
        </div>,
      );
      return { Renderable, title: "Spiele" };
    }

    const selectRounds = allRounds.map((r) => ({
      nr: r.nr,
      matches: r.matches.map((m) => ({
        nr: m.nr,
        paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
        points: m.result !== null ? m.tips.reduce((sum, t) => sum + (t.points ?? 0), 0) : null,
      })),
    }));

    const paarung = `${match.hometeam?.name ?? "–"} – ${match.awayteam?.name ?? "–"}`;
    const totalPoints = match.result
      ? match.tips.reduce((sum, t) => sum + (t.points ?? 0), 0)
      : null;

    const SpielView = () => (
      <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
        <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
          <SpielSelect rounds={selectRounds} currentNr={match.nr} />
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
