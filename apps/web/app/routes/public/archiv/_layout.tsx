import { cx } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon, FoldersIcon } from "lucide-react";
import { data, Link, Outlet, useLocation } from "react-router";

import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import {
  getAdjacentArchivChampionships,
  getArchivChampionshipBySlug,
} from "#/lib/archiv.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_layout";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

/**
 * Archive branch of the shared championship views — scoped to the championship
 * named by :slug. The root branch is `_championship-layout.tsx`; both mount the
 * same view files, see docs/championship-scope-plan.md.
 *
 * Chrome here is only what the root branch does *not* need: getting back out of
 * the archive, and moving between seasons. The championship itself is named by
 * each view's own heading, so this bar deliberately does not repeat it.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ params, context }) => {
  context.set(viewedChampionshipContext, await getArchivChampionshipBySlug(params.slug));
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext);
  // Thrown from the loader, not the middleware — see the note in the root
  // branch layout; it also lets the views below assert the context non-null.
  if (!championship) throw data("Turnier nicht gefunden.", { status: 404 });

  const { prev, next } = await getAdjacentArchivChampionships(championship.nr);
  return { slug: championship.slug, prev, next };
}

export default function ArchivChampionshipLayout({ loaderData }: Route.ComponentProps) {
  const { slug, prev, next } = loaderData;
  // Season switching keeps whichever view is open, rather than dropping back to
  // the overview: /archiv/a/spiele → /archiv/b/spiele.
  const rest = useLocation().pathname.replace(`/archiv/${slug}`, "");

  return (
    <ChampionshipScopeProvider basePath={`/archiv/${slug}`}>
      {/* Grid, not flex+justify-between: a 3-column grid keeps "Archiv"
          centred even when prev or next is absent — justify-between would
          pull it toward whichever side still has content. */}
      <div className="xs:px-0 mx-auto grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-8">
        {prev ? (
          <Link
            to={`/archiv/${prev.slug}${rest}`}
            prefetch="intent"
            className={cx(navLinkClass, "min-w-0 max-w-[70%] text-sm")}
          >
            <ChevronLeftIcon className="size-4 shrink-0" />
            {/* Truncates from the start so the trailing year — the only part
                that distinguishes adjacent half-seasons — always survives. */}
            <span className="truncate text-left [direction:rtl]">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}

        <Link
          to="/archiv"
          prefetch="intent"
          className={cx(navLinkClass, "shrink-0 text-xs hover:underline")}
        >
          <FoldersIcon className="size-3.5 shrink-0" />
          Archiv
        </Link>

        {next ? (
          <Link
            to={`/archiv/${next.slug}${rest}`}
            prefetch="intent"
            className={cx(navLinkClass, "min-w-0 max-w-[70%] justify-end justify-self-end text-sm")}
          >
            <span className="truncate text-left">{next.name}</span>
            <ChevronRightIcon className="size-4 shrink-0" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <Outlet />
    </ChampionshipScopeProvider>
  );
}
