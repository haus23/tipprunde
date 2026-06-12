import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

import { PlayerSwitch } from "#/components/player-switch.tsx";
import { TipFlag } from "#/components/tip-flag.tsx";
import { formatDate } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";
import { playerMatchesQueryOptions } from "#/lib/spieler.ts";
import type { PlayerRound } from "#/lib/spieler.ts";

export const Route = createFileRoute("/_championship/spieler/{-$slug}")({
  loader: async ({ context, params }) => {
    const championshipId = context.championship?.id;
    if (championshipId === undefined) return;

    const { ranking } = await context.queryClient.ensureQueryData(
      rankingQueryOptions(championshipId),
    );
    if (ranking.length === 0) return;

    // No slug → resolve a default: the logged-in user if enrolled, else rank 1.
    if (!params.slug) {
      const self = context.user && ranking.find((p) => p.userId === context.user!.id);
      throw redirect({ to: "/spieler/{-$slug}", params: { slug: self?.slug ?? ranking[0].slug } });
    }

    const player = ranking.find((p) => p.slug === params.slug);
    if (player) {
      await context.queryClient.ensureQueryData(
        playerMatchesQueryOptions(championshipId, player.userId),
      );
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <p className="text-subtle py-16 text-center">Kein aktives Turnier.</p>
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
  const {
    data: { ranking },
  } = useSuspenseQuery(rankingQueryOptions(championshipId));

  const player = ranking.find((p) => p.slug === slug);
  if (!player) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <p className="text-subtle py-16 text-center">Kein Spieler mit dem Kürzel „{slug}“.</p>
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

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
          <PlayerSwitch
            players={ranking.map((p) => ({ slug: p.slug, name: p.name }))}
            currentSlug={player.slug}
          />
        </div>
        <p className="text-subtle text-sm">
          {championshipName} · Platz {player.rank} · {player.total} Punkte
          <br className="xs:hidden" />
          <span className="xs:inline hidden"> · </span>
          {playerSpiele} Spiele{playerAvg !== null && ` · Ø ${playerAvg}`}
        </p>
      </div>

      {rounds.length === 0 ? (
        <p className="text-subtle px-4">Noch keine Runden gespielt.</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {rounds.map((round, i) => (
            <RoundAccordion key={round.id} round={round} defaultOpen={i === defaultOpenIndex} />
          ))}
        </div>
      )}
    </div>
  );
}

function RoundAccordion({ round, defaultOpen }: { round: PlayerRound; defaultOpen: boolean }) {
  const matchesWithResult = round.matches.filter((m) => m.result !== null).length;
  const totalMatches = round.matches.length;
  const roundPoints = round.matches.reduce((sum, m) => sum + (m.tips[0]?.points ?? 0), 0);
  const roundAvg =
    round.tipsPublished && matchesWithResult > 0
      ? (roundPoints / matchesWithResult).toFixed(2)
      : null;
  const roundSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;

  return (
    <details
      name="runden"
      open={defaultOpen}
      className="group bg-surface-raised border-subtle xs:rounded-md xs:border border-y transition-[margin] duration-300 ease-out open:my-2 first:open:mt-0 last:open:mb-0"
    >
      <summary className="focus-visible:ring-accent xs:rounded-md xs:px-4 flex cursor-pointer list-none items-center justify-between px-3 py-3 outline-none select-none focus-visible:ring-2 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium">Runde {round.nr}</span>
        <span className="flex items-center gap-3">
          <span className="text-subtle flex items-center gap-2 text-xs">
            {round.tipsPublished && <span>{roundPoints} Pkt</span>}
            <span>{roundSpiele} Sp.</span>
            {roundAvg !== null && <span>Ø {roundAvg}</span>}
          </span>
          <ChevronDownIcon className="text-subtle size-3.5 transition-transform duration-200 group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-subtle xs:px-4 border-t px-3 py-2">
        <table className="w-full">
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
                    {match.nr}
                  </td>
                  <td className="hidden w-px px-2 py-3 tabular-nums md:table-cell">
                    {match.date ? formatDate(match.date) : "–"}
                  </td>
                  <td className="xs:px-2 px-1 py-3">
                    <span className="hidden sm:inline">
                      {match.hometeam?.name ?? "–"} – {match.awayteam?.name ?? "–"}
                    </span>
                    <span className="sm:hidden">
                      {match.hometeam?.shortName ?? "–"} – {match.awayteam?.shortName ?? "–"}
                    </span>
                  </td>
                  <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                    {match.result ?? "–:–"}
                  </td>
                  <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                    {showTip ? tip.tip : "–"}
                    {showTip && tip.joker && <TipFlag label="Joker-Tipp" />}
                  </td>
                  <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                    {tip?.points != null ? tip.points : "–"}
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
