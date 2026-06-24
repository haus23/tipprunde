import { useSuspenseQuery } from "@tanstack/react-query";

import { rankingQueryOptions, resolvePlayer } from "#/lib/ranking.ts";
import type { SessionUser } from "#/lib/session.ts";

import { PlayerCard } from "./-player-card.tsx";

export function SpielerView({
  championshipId,
  championshipName,
  slug,
  user,
}: {
  championshipId: number;
  championshipName: string;
  slug: string | undefined;
  user: SessionUser | null;
}) {
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
          Kein Spieler mit dem Kürzel „{slug}".
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
