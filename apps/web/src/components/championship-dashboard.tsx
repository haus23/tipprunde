import { useSuspenseQuery } from "@tanstack/react-query";

import { ChampionshipArchivPreview } from "#/components/championship-archiv-preview.tsx";
import { ChampionshipCurrentMatches } from "#/components/championship-current-matches.tsx";
import { ChampionshipRegelwerk } from "#/components/championship-regelwerk.tsx";
import { ChampionshipStandings } from "#/components/championship-standings.tsx";
import { archivPreviewQueryOptions } from "#/lib/archiv.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import type { SessionUser } from "#/lib/session.ts";
import { currentMatchesQueryOptions } from "#/lib/spiele.ts";

export function ChampionshipDashboard({
  championshipId,
  championshipName,
  completed,
  user,
}: {
  championshipId: number;
  championshipName: string;
  completed: boolean;
  user: SessionUser | null;
}) {
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championshipId));
  const {
    data: { matches },
  } = useSuspenseQuery(currentMatchesQueryOptions(championshipId));
  const {
    data: { ruleset },
  } = useSuspenseQuery(rulesetQueryOptions(championshipId));
  const {
    data: { championships: archivChampionships },
  } = useSuspenseQuery(archivPreviewQueryOptions(championshipId));

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-10 flex flex-col items-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-1 text-lg">{championshipName}</p>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          <ChampionshipStandings ranking={ranking} completed={completed} userId={user?.id} />
          <ChampionshipCurrentMatches matches={matches} completed={completed} />
        </div>
        {ruleset && <ChampionshipRegelwerk ruleset={ruleset} />}
        {archivChampionships.length > 0 && (
          <ChampionshipArchivPreview championships={archivChampionships} />
        )}
      </div>
    </div>
  );
}
