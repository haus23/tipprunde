import { useSuspenseQuery } from "@tanstack/react-query";

import type { RankedPlayer } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import { playerMatchesQueryOptions } from "#/lib/spieler.ts";

import { PlayerRoundItem } from "./-player-round-item.tsx";
import { PlayerSwitch } from "./-player-switch.tsx";

export function PlayerCard({
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
