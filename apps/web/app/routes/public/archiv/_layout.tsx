import { ChevronLeftIcon } from "lucide-react";
import { data, Link, Outlet } from "react-router";

import { getArchivChampionshipBySlug } from "#/lib/archiv.server.ts";
import { archivChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_layout";
import { ArchivSubNav } from "./_nav.tsx";

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

export function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(archivChampionshipContext);
  if (!championship) throw data("Turnier nicht gefunden.", { status: 404 });
  return { championship };
}

export default function ArchivChampionshipLayout({ loaderData }: Route.ComponentProps) {
  const { championship } = loaderData;

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link
          to="/archiv"
          prefetch="intent"
          className="text-subtle hover:text-app focus-visible:ring-accent mb-1 flex items-center gap-1 rounded-sm text-xs transition-colors outline-none focus-visible:ring-2"
        >
          <ChevronLeftIcon className="size-3" />
          Archiv
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <ArchivSubNav slug={championship.slug} />
      </div>

      <Outlet />
    </div>
  );
}
