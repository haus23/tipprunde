import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { calcGoalDeviation } from "@tipprunde/domain/scoring";

import { CellFlag } from "#/components/cell-flag.tsx";
import { CellLink } from "#/components/cell-link.tsx";
import { PlayerSwitch } from "#/components/player-switch.tsx";
import { RoundAccordion } from "#/components/round-accordion.tsx";
import { formatDate, pageTitle } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import { playerMatchesQueryOptions } from "#/lib/spieler.ts";
import type { PlayerRound } from "#/lib/spieler.ts";

export const Route = createFileRoute("/_championship/tipps/{-$slug}")({
  loader: async ({ context, params }) => {
    const championshipId = context.championship?.id;
    if (championshipId === undefined) return;

    const [ranking] = await Promise.all([
      context.queryClient.ensureQueryData(rankingQueryOptions(championshipId)),
      context.queryClient.ensureQueryData(rulesetQueryOptions(championshipId)),
    ]);

    // No redirect: /spieler shows the resolved default player directly.
    const player = resolvePlayer(ranking, params.slug, context.user?.id);
    if (player) {
      await context.queryClient.ensureQueryData(
        playerMatchesQueryOptions(championshipId, player.userId),
      );
    }
    return { playerName: player?.name, championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle(loaderData?.playerName, loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

/** Player to show: explicit slug, else the logged-in user if enrolled, else rank 1. */
function resolvePlayer(
  ranking: RankedPlayer[],
  slug: string | undefined,
  userId: number | undefined,
): RankedPlayer | undefined {
  if (slug) return ranking.find((p) => p.slug === slug);
  const self = userId !== undefined ? ranking.find((p) => p.userId === userId) : undefined;
  return self ?? ranking[0];
}

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <SpielerView championshipId={championship.id} championshipName={championship.name} />;
}

function SpielerView({
  championshipId,
  championshipName,
}: {
  championshipId: number;
  championshipName: string;
}) {
  const { slug } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championshipId));

  if (ranking.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Noch keine Spieler.</p>
      </div>
    );
  }

  const player = resolvePlayer(ranking, slug, user?.id);
  if (!player) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">
          Kein Spieler mit dem Kürzel „{slug}“.
        </p>
      </div>
    );
  }

  return (
    <PlayerCard
      championshipId={championshipId}
      championshipName={championshipName}
      ranking={ranking}
      player={player}
    />
  );
}

function PlayerCard({
  championshipId,
  championshipName,
  ranking,
  player,
}: {
  championshipId: number;
  championshipName: string;
  ranking: RankedPlayer[];
  player: RankedPlayer;
}) {
  const {
    data: { rounds },
  } = useSuspenseQuery(playerMatchesQueryOptions(championshipId, player.userId));
  const {
    data: { ruleset },
  } = useSuspenseQuery(rulesetQueryOptions(championshipId));
  const hasDeviationRule = ruleset?.roundRuleId === "torabweichung-bonus-malus";

  const allMatches = rounds.flatMap((r) => r.matches);
  const matchesWithResult = allMatches.filter((m) => m.result !== null).length;
  const totalMatches = allMatches.length;
  // Per-match average uses tip points only — extra-question points aren't per-match.
  const playerAvg =
    matchesWithResult > 0 ? (player.tipPoints / matchesWithResult).toFixed(2) : null;
  const playerSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;
  const lastResultIndex = rounds.findLastIndex((r) => r.matches.some((m) => m.result !== null));
  const defaultOpenIndex = lastResultIndex >= 0 ? lastResultIndex : 0;
  const hasRoundPoints = rounds.some((r) => r.roundPoints.length > 0);

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
          <PlayerSwitch
            players={ranking.map((p) => ({ slug: p.slug, name: p.name }))}
            currentSlug={player.slug}
          />
        </div>
        <p className="text-subtle text-center text-sm leading-relaxed">
          {championshipName} · Platz {player.rank}
          <br className="xs:hidden" />
          <span className="xs:inline hidden"> · </span>
          {player.tipPoints} Tippunkte · {playerSpiele} Spiele
          {playerAvg !== null && ` · Ø ${playerAvg}`}
          {(player.extraQuestionPoints > 0 || hasRoundPoints) && (
            <>
              <br />
              {player.extraQuestionPoints > 0 && `${player.extraQuestionPoints} Zusatzpunkte`}
              {player.extraQuestionPoints > 0 && hasRoundPoints && " · "}
              {hasRoundPoints &&
                `${player.roundPoints! > 0 ? `+${player.roundPoints}` : player.roundPoints! < 0 ? String(player.roundPoints) : "±0"} Rundenpunkte`}
            </>
          )}
        </p>
      </div>

      {rounds.length === 0 ? (
        <p className="text-subtle px-4 text-base">Noch keine Runden gespielt.</p>
      ) : (
        <div className="border-subtle border-t">
          {rounds.map((round, i) => (
            <PlayerRoundItem
              key={round.id}
              round={round}
              defaultOpen={i === defaultOpenIndex}
              hasDeviationRule={hasDeviationRule}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerRoundItem({
  round,
  defaultOpen,
  hasDeviationRule,
}: {
  round: PlayerRound;
  defaultOpen: boolean;
  hasDeviationRule: boolean;
}) {
  const matchesWithResult = round.matches.filter((m) => m.result !== null).length;
  const totalMatches = round.matches.length;
  const roundPoints = round.matches.reduce((sum, m) => sum + (m.tips[0]?.points ?? 0), 0);
  const roundAvg =
    round.tipsPublished && matchesWithResult > 0
      ? (roundPoints / matchesWithResult).toFixed(2)
      : null;
  const deviationSum = hasDeviationRule
    ? round.matches
        .filter((m) => m.result !== null)
        .reduce((sum, m) => sum + calcGoalDeviation(m.tips[0]?.tip ?? null, m.result!), 0)
    : null;
  const roundBonus = round.roundPoints[0]?.points ?? null;
  const roundSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;

  return (
    <RoundAccordion
      title={`Runde ${round.nr}`}
      defaultOpen={defaultOpen}
      meta={
        <span className="text-subtle flex items-center gap-2 text-xs">
          {round.tipsPublished && <span>{roundPoints} Pkt</span>}
          <span>{roundSpiele} Sp.</span>
          {roundAvg !== null && <span>Ø {roundAvg}</span>}
          {deviationSum !== null && <span>Abw. {deviationSum}</span>}
          {roundBonus !== null && (
            <span className={roundBonus > 0 ? "text-accent" : roundBonus < 0 ? "text-error" : ""}>
              {roundBonus > 0 ? `+${roundBonus}` : roundBonus < 0 ? String(roundBonus) : "±0"}
            </span>
          )}
        </span>
      }
    >
      <table className="w-full text-base">
        <thead>
          <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-right font-medium">#</th>
            <th className="hidden w-px px-2 pt-2 pb-3 font-medium md:table-cell">Datum</th>
            <th className="xs:px-2 px-1 pt-2 pb-3 font-medium">Paarung</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Erg.</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Tipp</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {round.matches.map((match) => {
            const tip = match.tips[0];
            const showTip = round.tipsPublished && tip?.tip;
            return (
              <tr key={match.id} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle xs:px-2 w-px px-1 py-3 text-right tabular-nums">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    {match.nr}
                  </CellLink>
                </td>
                <td className="hidden w-px px-2 py-3 tabular-nums md:table-cell">
                  {match.date ? formatDate(match.date) : "–"}
                </td>
                <td className="xs:px-2 px-1 py-3">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    <span className="hidden sm:inline">
                      {match.hometeam?.name ?? "–"} – {match.awayteam?.name ?? "–"}
                    </span>
                    <span className="sm:hidden">
                      {match.hometeam?.shortName ?? "–"} – {match.awayteam?.shortName ?? "–"}
                    </span>
                  </CellLink>
                </td>
                <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                  {match.result ?? "–:–"}
                </td>
                <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                  {showTip ? tip.tip : "–"}
                  {showTip && tip.joker && <CellFlag label="Joker-Tipp" />}
                  {showTip && tip.extraJoker && <CellFlag label="Zusatzjoker-Tipp" />}
                </td>
                <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                  {tip?.points != null ? tip.points : "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </RoundAccordion>
  );
}
