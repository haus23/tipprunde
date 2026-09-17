import { cx } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon, FoldersIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

import { useChampionshipScope } from "#/components/championship-scope.tsx";
import { getAdjacentChampionships } from "#/lib/archiv.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_championship-chrome";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

/**
 * The season-switching bar — prev/next championship plus a way back to the
 * Archiv list. Mounted **twice**, same file both times: around the running
 * championship's non-home views, and around every archived championship's
 * views (index included — unlike the running one, an archived championship
 * has no competing "homepage" identity at its own index URL, so nothing
 * needs to be carved out there). Whichever branch mounted it already set
 * `viewedChampionshipContext` and the `ChampionshipScopeProvider`, so this
 * file only reads them — it does not know or care which branch it is in.
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  return getAdjacentChampionships(championship.nr);
}

export default function ChampionshipChrome({ loaderData }: Route.ComponentProps) {
  const { prev, next } = loaderData;
  const { basePath } = useChampionshipScope();
  // Season switching keeps whichever view is open, rather than dropping back
  // to the overview: .../a/tabelle → .../b/tabelle. Match numbers are the one
  // exception — unlike a player, a match number carries no meaning across
  // seasons (match 38 of two different Rückrunden have nothing to do with
  // each other), so it would resolve or 404 by coincidence rather than
  // intent. Falls back to that season's Spiele overview instead.
  const rawRest = useLocation().pathname.replace(basePath, "");
  const rest = /^\/spiele\/\d+/.test(rawRest) ? "/spiele" : rawRest;

  return (
    <>
      {/* Grid, not flex+justify-between: a 3-column grid keeps "Archiv"
          centred even when prev or next is absent — justify-between would
          pull it toward whichever side still has content. */}
      <div className="xs:px-0 mx-auto grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-8">
        {prev ? (
          <Link
            to={`/archiv/turnier/${prev.slug}${rest}`}
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
            to={`/archiv/turnier/${next.slug}${rest}`}
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
    </>
  );
}
