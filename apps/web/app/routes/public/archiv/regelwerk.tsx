import { ChampionshipRegelwerk } from "#/components/championship-regelwerk.tsx";
import { getRuleset } from "#/lib/championship.server.ts";
import { archivChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/regelwerk";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(archivChampionshipContext)!;
  const ruleset = await getRuleset(championship.id);
  return { championship, ruleset };
}

export default function ArchivRegelwerk({ loaderData }: Route.ComponentProps) {
  const { championship, ruleset } = loaderData;

  return (
    <>
      <title>{`Regelwerk · ${championship.name} · Archiv · runde.tips`}</title>
      {ruleset ? (
        <ChampionshipRegelwerk ruleset={ruleset} showHeading={false} />
      ) : (
        <p className="text-subtle py-16 text-center text-base">Kein Regelwerk hinterlegt.</p>
      )}
    </>
  );
}
