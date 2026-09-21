import { data, Outlet } from "react-router";

import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { getPublicChampionshipBySlug } from "#/lib/archiv.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_layout";

/**
 * Championship-by-slug branch of the shared views — scoped to whichever
 * published championship :slug names, current or archived alike. The other
 * two branches are `_championship-layout.tsx` (root, "/") and its /turnier
 * mount (see routes.ts); all three mount the same view files, see
 * docs/decisions/05-championship-scope.md and
 * docs/decisions/11-turnier-stadionsenf-routing.md.
 *
 * Renders no chrome of its own — the season-switching bar lives in
 * `_championship-chrome.tsx`, mounted below this for every view including
 * the index, since a championship reached this way (unlike "/") has no
 * competing "homepage" identity at its own index URL that would need it
 * carved out.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ params, context }) => {
  context.set(viewedChampionshipContext, await getPublicChampionshipBySlug(params.slug));
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export async function loader({ context, params }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext);
  // Thrown from the loader, not the middleware — see the note in the root
  // branch layout; it also lets the views below assert the context non-null.
  if (!championship) throw data("Turnier nicht gefunden.", { status: 404 });
  return { slug: params.slug };
}

export default function TurnierSlugScope({ loaderData }: Route.ComponentProps) {
  return (
    <ChampionshipScopeProvider basePath={`/turnier/${loaderData.slug}`}>
      <Outlet />
    </ChampionshipScopeProvider>
  );
}
