import { publicChampionshipContext, userContext } from "#/lib/context.ts";
import { getRanking, type RankedPlayer, resolvePlayer } from "#/lib/ranking.server.ts";
import { getPlayerMatches, getRuleset, type PlayerRound } from "#/lib/spieler.server.ts";

import type { Route } from "./+types/index";
import { PlayerSwitch } from "./player-switch.tsx";
import { PlayerRoundItem } from "./round-item.tsx";

export async function loader({ context, params }: Route.LoaderArgs) {
  const championship = context.get(publicChampionshipContext);
  const user = context.get(userContext);

  const empty = {
    championshipName: null as string | null,
    player: null as RankedPlayer | null,
    players: [] as { slug: string; name: string }[],
    rounds: [] as PlayerRound[],
    hasDeviationRule: false,
    requestedSlug: params.slug,
    hasPlayers: false,
  };

  if (!championship) return empty;

  const [ranking, ruleset] = await Promise.all([
    getRanking(championship.id),
    getRuleset(championship.id),
  ]);

  // No redirect — /tipps shows the resolved default player directly.
  const player = resolvePlayer(ranking, params.slug, user?.id) ?? null;

  return {
    ...empty,
    championshipName: championship.name,
    player,
    players: ranking.map((p) => ({ slug: p.slug, name: p.name })),
    rounds: player ? await getPlayerMatches(championship.id, player.userId) : [],
    hasDeviationRule: ruleset?.roundRuleId === "torabweichung-bonus-malus",
    hasPlayers: ranking.length > 0,
  };
}

export default function Tipps({ loaderData }: Route.ComponentProps) {
  const { championshipName, player, players, rounds, hasDeviationRule, requestedSlug, hasPlayers } =
    loaderData;

  if (!championshipName) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <title>Spieler · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <title>Spieler · runde.tips</title>
        <p className="text-subtle py-16 text-center text-base">
          {hasPlayers ? `Kein Spieler mit dem Kürzel „${requestedSlug}".` : "Noch keine Spieler."}
        </p>
      </div>
    );
  }

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
      <title>{`${player.name} · ${championshipName} · runde.tips`}</title>
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
          <PlayerSwitch players={players} currentSlug={player.slug} />
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
