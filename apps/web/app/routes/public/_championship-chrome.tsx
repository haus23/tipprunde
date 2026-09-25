import { Logo, cx } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon, FoldersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";

import { useChampionshipScope } from "#/components/championship-scope.tsx";
import { getAdjacentChampionships } from "#/lib/archiv.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_championship-chrome";
import { PublicNavLink, championshipNavItems } from "./_nav-link.tsx";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

/** Height of the public header (`h-14`) — once scrolled past it, the header is
 * gone and this row's own logo has to take over the way home. */
const HEADER_HEIGHT = 56;

function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const update = () => setPast(window.scrollY > px);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [px]);
  return past;
}

/**
 * The championship level of the public nav — and the season switching
 * (prev/next championship, plus a way to the Archiv list) alongside it.
 * Mounted **three times**, same file every time: around the running
 * championship's non-home views ("/"'s siblings), around its /turnier mount
 * (index included), and around every other published championship's views
 * under /turnier/:slug. Whichever branch mounted it already set
 * `viewedChampionshipContext` and the `ChampionshipScopeProvider`, so this
 * file only reads them — it does not know or care which branch it is in.
 *
 * Two shapes, one per breakpoint (see docs/decisions/11-turnier-stadionsenf-routing.md):
 * from `sm` up, one sticky row naming the championship, carrying its nav and
 * the season switching — the public header above it scrolls away. Below
 * `sm` the public header already swapped its own items for the championship
 * nav, so only the season switching is left here, in the page flow.
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const adjacent = await getAdjacentChampionships(championship.nr);
  return { ...adjacent, name: championship.name };
}

export default function ChampionshipChrome({ loaderData }: Route.ComponentProps) {
  const { prev, next, name } = loaderData;
  const { basePath } = useChampionshipScope();
  const scrolledPastHeader = useScrolledPast(HEADER_HEIGHT);
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
      {/* sm+: the sticky championship row. -mx-4 cancels main's padding so
          the border runs full width like the header's. */}
      <div className="border-subtle bg-surface sticky top-0 z-10 -mx-4 hidden border-b sm:block">
        <div className="mx-auto grid h-10 max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            {/* Always in the flow, only faded — so the name beside it never
                jumps when the logo appears. */}
            <Link
              to="/"
              prefetch="intent"
              aria-label="Startseite"
              aria-hidden={!scrolledPastHeader}
              tabIndex={scrolledPastHeader ? undefined : -1}
              className={cx(
                "text-accent focus-visible:ring-accent size-5 shrink-0 rounded-sm outline-none transition-opacity duration-150 ease-out focus-visible:ring-2",
                scrolledPastHeader ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Logo />
            </Link>
            <span className="truncate text-sm font-medium">{name}</span>
          </div>

          <nav className="flex h-10 items-center gap-1">
            {championshipNavItems.map((item) => (
              <PublicNavLink key={item.to} to={`${basePath}${item.to}`}>
                {item.label}
              </PublicNavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-self-end text-xs">
            {prev ? (
              <Link
                to={`/turnier/${prev.slug}${rest}`}
                prefetch="intent"
                aria-label={`Vorheriges Turnier: ${prev.name}`}
                title={prev.name}
                className={navLinkClass}
              >
                <ChevronLeftIcon className="size-4" />
              </Link>
            ) : (
              <span className="size-4" />
            )}
            <Link to="/archiv" prefetch="intent" className={cx(navLinkClass, "hover:underline")}>
              <FoldersIcon className="size-3.5 shrink-0" />
              Archiv
            </Link>
            {next ? (
              <Link
                to={`/turnier/${next.slug}${rest}`}
                prefetch="intent"
                aria-label={`Nächstes Turnier: ${next.name}`}
                title={next.name}
                className={navLinkClass}
              >
                <ChevronRightIcon className="size-4" />
              </Link>
            ) : (
              <span className="size-4" />
            )}
          </div>
        </div>
      </div>

      {/* Below sm: season switching only, in the page flow. Grid, not
          flex+justify-between: a 3-column grid keeps "Archiv" centred even
          when prev or next is absent. */}
      <div className="xs:px-0 mx-auto grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-8 sm:hidden">
        {prev ? (
          <Link
            to={`/turnier/${prev.slug}${rest}`}
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
            to={`/turnier/${next.slug}${rest}`}
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
