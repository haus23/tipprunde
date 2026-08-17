import { cx } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { data, Link, Outlet, useLocation } from "react-router";

import {
  getAdjacentArchivChampionships,
  getArchivChampionshipBySlug,
} from "#/lib/archiv.server.ts";
import { archivChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_layout";
import { ArchivSubNav } from "./_nav.tsx";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

/**
 * Resolves the Archiv's championship (by :slug) once, so `tabelle.tsx` and
 * `regelwerk.tsx` below don't each look it up — same pattern as
 * `_championship-layout.tsx`. The 404 itself is thrown from the loader, not
 * here: a `data()` thrown in middleware never reaches an ErrorBoundary.
 */
const resolveChampionship: Route.MiddlewareFunction = async ({ params, context }) => {
  context.set(archivChampionshipContext, await getArchivChampionshipBySlug(params.slug));
};

export const middleware: Route.MiddlewareFunction[] = [resolveChampionship];

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(archivChampionshipContext);
  if (!championship) throw data("Turnier nicht gefunden.", { status: 404 });

  const { prev, next } = await getAdjacentArchivChampionships(championship.nr);
  return { championship, prev, next };
}

export default function ArchivChampionshipLayout({ loaderData }: Route.ComponentProps) {
  const { championship, prev, next } = loaderData;
  // Prev/next stay on whichever sub-page (Abschlusstabelle/Regelwerk) is
  // currently open, rather than always landing back on the table.
  const isRegelwerk = useLocation().pathname.endsWith("/regelwerk");
  const suffix = isRegelwerk ? "/regelwerk" : "";

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="xs:px-0 relative mb-6 flex flex-col items-center gap-2 px-4">
        <Link
          to="/archiv"
          prefetch="intent"
          className="text-subtle hover:text-app focus-visible:ring-accent mb-1 flex items-center gap-1 rounded-sm text-xs transition-colors outline-none focus-visible:ring-2"
        >
          <ChevronLeftIcon className="size-3" />
          Archiv
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>

        <div className="xs:px-0 mt-2 flex w-full justify-between md:pointer-events-none md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:-translate-y-1/2">
          {prev ? (
            <Link
              to={`/archiv/${prev.slug}${suffix}`}
              prefetch="intent"
              className={cx(navLinkClass, "xs:ml-4 pointer-events-auto max-w-[40%] text-sm")}
            >
              <ChevronLeftIcon className="size-4 shrink-0" />
              {/* Truncates from the *start*, not the end: for names like
                  "Rückrunde 2003/04", the distinguishing part is the trailing
                  year — end-truncation crops exactly that. Flipping direction
                  moves the ellipsis to the front while the (LTR) text content
                  itself renders unaffected. */}
              <span className="truncate text-left [direction:rtl]">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/archiv/${next.slug}${suffix}`}
              prefetch="intent"
              className={cx(navLinkClass, "xs:mr-4 pointer-events-auto max-w-[40%] text-sm")}
            >
              <span className="truncate text-left">{next.name}</span>
              <ChevronRightIcon className="size-4 shrink-0" />
            </Link>
          )}
        </div>

        <ArchivSubNav slug={championship.slug} />
      </div>

      <Outlet />
    </div>
  );
}
