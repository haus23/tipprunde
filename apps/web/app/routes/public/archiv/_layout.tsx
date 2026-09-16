import { data, Outlet } from "react-router";

import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { getArchivChampionshipBySlug } from "#/lib/archiv.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_layout";

/**
 * Archive branch of the shared championship views — scoped to the championship
 * named by :slug. The root branch is `_championship-layout.tsx`; both mount the
 * same view files, see docs/decisions/05-championship-scope.md.
 *
 * Renders no chrome of its own — same reasoning as the root branch. The
 * season-switching bar lives in `_championship-chrome.tsx`, mounted below
 * this for every view including the index, since an archived championship
 * (unlike the running one) has no competing "homepage" identity at its own
 * index URL that would need it carved out.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ params, context }) => {
  context.set(viewedChampionshipContext, await getArchivChampionshipBySlug(params.slug));
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export async function loader({ context, params }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext);
  // Thrown from the loader, not the middleware — see the note in the root
  // branch layout; it also lets the views below assert the context non-null.
  if (!championship) throw data("Turnier nicht gefunden.", { status: 404 });
  return { slug: params.slug };
}

export default function ArchivChampionshipScope({ loaderData }: Route.ComponentProps) {
  return (
    <ChampionshipScopeProvider basePath={`/archiv/turnier/${loaderData.slug}`}>
      <Outlet />
    </ChampionshipScopeProvider>
  );
}
