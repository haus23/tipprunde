import { data, Outlet } from "react-router";

import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { getPublishedChampionship } from "#/lib/championship.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_championship-layout";

/**
 * Root branch of the shared championship views — everything below is scoped to
 * the **running** championship (latest published). The archive branch is
 * `archiv/_layout.tsx`; both mount the same view files, see
 * docs/decisions/05-championship-scope.md.
 *
 * Renders no chrome of its own: each view already carries its own heading and
 * names the championship, so anything here would only duplicate it.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ context }) => {
  context.set(viewedChampionshipContext, (await getPublishedChampionship()) ?? null);
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export function loader({ context, url }: Route.LoaderArgs) {
  // Thrown from the loader, not the middleware — a `data()` thrown in
  // middleware never reaches an ErrorBoundary (see apps/web/CLAUDE.md). It also
  // lets the views below assert the context non-null.
  if (!context.get(viewedChampionshipContext)) {
    throw data("Kein aktives Turnier.", { status: 404 });
  }
  // Mounted twice (routes.ts): at the root and under /turnier. Only the prefix
  // tells the two apart — the same file cannot hardcode either.
  const underTurnier = url.pathname === "/turnier" || url.pathname.startsWith("/turnier/");
  return { basePath: underTurnier ? "/turnier" : "" };
}

export default function CurrentChampionshipLayout({ loaderData }: Route.ComponentProps) {
  return (
    <ChampionshipScopeProvider basePath={loaderData.basePath}>
      <Outlet />
    </ChampionshipScopeProvider>
  );
}
