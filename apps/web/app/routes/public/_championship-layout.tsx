import { data, Outlet } from "react-router";

import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { getPublishedChampionship } from "#/lib/championship.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_championship-layout";

/**
 * /turnier branch of the shared championship views — everything below is
 * scoped to the **running** championship (latest published). The by-slug
 * branch is `turnier/_layout.tsx`; both mount the same view files, see
 * docs/decisions/05-championship-scope.md.
 *
 * Renders no chrome of its own: each view already carries its own heading and
 * names the championship, so anything here would only duplicate it.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ context }) => {
  context.set(viewedChampionshipContext, (await getPublishedChampionship()) ?? null);
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export function loader({ context }: Route.LoaderArgs) {
  // Thrown from the loader, not the middleware — a `data()` thrown in
  // middleware never reaches an ErrorBoundary (see apps/web/CLAUDE.md). It also
  // lets the views below assert the context non-null.
  if (!context.get(viewedChampionshipContext)) {
    throw data("Kein aktives Turnier.", { status: 404 });
  }
  return null;
}

export default function CurrentChampionshipLayout() {
  return (
    <ChampionshipScopeProvider basePath="/turnier">
      <Outlet />
    </ChampionshipScopeProvider>
  );
}
