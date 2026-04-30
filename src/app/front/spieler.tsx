import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { eq, sum } from "drizzle-orm";
import { ChevronDownIcon } from "lucide-react";
import * as v from "valibot";

import { SpielerSelect } from "#/components/spieler-select.tsx";
import { computeRanking } from "#/domain/ranking.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

export const fetchSpielerFn = createServerFn({ method: "GET" })
  .inputValidator(v.object({ name: v.optional(v.string()) }))
  .handler(async ({ data }) => {
    const championship = await getLatestPublishedChampionship();

    if (!championship) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="text-subtle text-sm">Noch kein aktives Turnier.</p>
        </div>,
      );
      return { Renderable, title: "Spieler" };
    }

    const allPlayers = await getPlayers(championship.id);
    const pointRows = await db
      .select({ userId: tips.userId, points: sum(tips.points) })
      .from(tips)
      .innerJoin(matches, eq(tips.matchId, matches.id))
      .innerJoin(rounds, eq(matches.roundId, rounds.id))
      .where(eq(rounds.championshipId, championship.id))
      .groupBy(tips.userId);

    const playerPoints = allPlayers.map((p) => ({
      userId: p.userId,
      name: p.user?.name ?? "",
      slug: p.user?.slug ?? "",
      points: Number(pointRows.find((r) => r.userId === p.userId)?.points ?? 0),
    }));

    const ranking = computeRanking(playerPoints).map((entry) => ({
      ...entry,
      ...playerPoints.find((p) => p.userId === entry.userId)!,
    }));

    let target = ranking[0];
    if (data.name) {
      const found = ranking.find((e) => e.slug === data.name);
      if (found) target = found;
    }

    if (!target) {
      const Renderable = await renderServerComponent(
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <p className="text-subtle text-sm">Noch keine Spieler registriert.</p>
        </div>,
      );
      return { Renderable, title: "Spieler" };
    }

    const player = target;

    const publishedRounds = await db.query.rounds.findMany({
      where: { championshipId: championship.id, published: true },
      orderBy: { nr: "asc" },
      with: {
        matches: {
          orderBy: { nr: "asc" },
          with: {
            hometeam: true,
            awayteam: true,
            tips: { where: { userId: player.userId } },
          },
        },
      },
    });

    const lastResultIndex = publishedRounds.findLastIndex((r) =>
      r.matches.some((m) => m.result !== null),
    );
    const defaultOpenIndex = lastResultIndex >= 0 ? lastResultIndex : 0;

    const SpielerView = () => (
      <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
        <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
          <SpielerSelect
            players={ranking.map((e) => ({ slug: e.slug, name: e.name }))}
            currentSlug={player.slug}
          />
          <p className="text-subtle text-sm">
            {championship.name} · Platz {player.rank} · {player.points} Punkte
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          {publishedRounds.length === 0 ? (
            <p className="text-subtle px-4 text-sm">Noch keine Runden gespielt.</p>
          ) : (
            publishedRounds.map((round, i) => (
              <details
                key={round.id}
                name="runden"
                open={i === defaultOpenIndex}
                className="group bg-surface border-surface xs:rounded-md xs:border border-y transition-[margin] duration-300 ease-out open:my-3 open:first:mt-0 open:last:mb-0"
              >
                <summary className="focus-visible:ring-focus xs:rounded-md flex cursor-pointer list-none items-center justify-between px-4 py-3 outline-none select-none focus-visible:ring-2 focus-visible:ring-inset">
                  <span className="text-sm font-medium">Runde {round.nr}</span>
                  <ChevronDownIcon
                    size={14}
                    className="text-subtle transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="border-input border-t px-4 py-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-input border-b text-left">
                        <th className="text-subtle w-px px-2 pt-2 pb-3 text-right text-xs font-medium tracking-wide uppercase">
                          #
                        </th>
                        <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
                          Paarung
                        </th>
                        <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                          Erg.
                        </th>
                        <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                          Tipp
                        </th>
                        <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                          Pkt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {round.matches.map((match) => {
                        const tip = match.tips[0];
                        const showTip = round.tipsPublished && tip?.tip;
                        return (
                          <tr key={match.id} className="border-input border-b last:border-b-0">
                            <td className="w-px px-2 py-3 text-right tabular-nums">{match.nr}</td>
                            <td className="px-2 py-3">
                              <span className="hidden sm:inline">
                                {match.hometeam?.name ?? "–"} – {match.awayteam?.name ?? "–"}
                              </span>
                              <span className="sm:hidden">
                                {match.hometeam?.shortName ?? "–"} –{" "}
                                {match.awayteam?.shortName ?? "–"}
                              </span>
                            </td>
                            <td className="w-px px-2 py-3 text-center tabular-nums">
                              {match.result ?? "–:–"}
                            </td>
                            <td className="relative w-px px-6 py-3 text-center tabular-nums">
                              {showTip ? tip.tip : "–"}
                              {showTip && tip.joker && (
                                <span className="text-accent absolute top-1/2 right-1 -translate-y-1/2">
                                  ★
                                </span>
                              )}
                            </td>
                            <td className="w-px px-2 py-3 text-center tabular-nums">
                              {tip?.points != null ? tip.points : "–"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            ))
          )}
        </div>
      </div>
    );

    const Renderable = await renderServerComponent(<SpielerView />);
    return { Renderable, title: `${player.name} | ${championship.name}` };
  });
