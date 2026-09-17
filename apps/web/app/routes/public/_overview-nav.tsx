import { Link, Outlet, useLocation } from "react-router";

import { useChampionshipScope, useScopedPath } from "#/components/championship-scope.tsx";
import { getPublicChampionships } from "#/lib/championship.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_overview-nav";
import { ChampionshipSwitcher } from "./_switcher.tsx";

const tabLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2";

/**
 * The Übersicht/Tabelle/Verlauf trio's shared rahmen — title above, the
 * three tabs below, then whichever of the three is active. Mounted three
 * times, same file each time (see routes.ts for why it can't be one mount):
 * around the running championship's own index (outside the season chrome,
 * since "/" keeps its own identity), around the running championship's
 * Tabelle/Verlauf (inside the season chrome), and around all three archived
 * views together (also inside its chrome — an archived championship has no
 * competing "homepage" identity at its own index to protect).
 *
 * All three tabs always render, even the currently redundant "Übersicht" on
 * the running championship's own Tabelle/Verlauf (the header's home link
 * already reaches it) — deliberate, so the trio stays consistent if the
 * running championship's index ever stops being simply "/".
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const publicChampionships = await getPublicChampionships();

  // Sorted nr desc — the first entry is the running championship, the only
  // one the switcher links to "/" rather than its /archiv/turnier/<slug>.
  const runningSlug = publicChampionships[0]?.slug;
  const switcherChampionships = publicChampionships.map((c) => ({
    slug: c.slug,
    name: c.name,
    href: c.slug === runningSlug ? "/" : `/archiv/turnier/${c.slug}`,
  }));

  return {
    championship: {
      slug: championship.slug,
      name: championship.name,
      completed: championship.completed,
    },
    switcherChampionships,
  };
}

export default function OverviewNav({ loaderData }: Route.ComponentProps) {
  const { championship, switcherChampionships } = loaderData;
  const { isArchived } = useChampionshipScope();
  const scoped = useScopedPath();
  const pathname = useLocation().pathname;
  // Only "/" itself gets the site's rich identity block + switcher — "/tabelle"
  // and "/verlauf" get the same plain name heading an archived championship's
  // views do, so the trio looks uniform regardless of which tab is active.
  const isHome = !isArchived && pathname === "/";

  const tabs = [
    // matchNested only on Verlauf: its own route carries an optional
    // trailing :playerSlug. Übersicht's "to" is the branch's basePath, a
    // prefix of every one of these tabs' own paths too — matching nested
    // there would wrongly mark it active from Tabelle or Verlauf as well.
    { label: "Übersicht", to: scoped("/"), matchNested: false },
    {
      label: championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle",
      to: scoped("/tabelle"),
      matchNested: false,
    },
    { label: "Verlauf", to: scoped("/verlauf"), matchNested: true },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      {/* The site identity belongs to "/" alone; every other view here —
          Tabelle and Verlauf included, on either branch — gets the same
          plain heading. */}
      <div className="mb-6 flex flex-col items-center">
        {!isHome ? (
          <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        ) : (
          <>
            <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
            <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
            {/* relative + inline-block: the switcher trigger sits absolute,
                outside the flow, so it can't push the name off-centre the way
                a flex row of [name, button] would — the row's combined
                width, not the text alone, is what a flex parent centres. */}
            <p className="text-subtle relative mt-1 inline-block text-lg">
              {championship.name}
              <ChampionshipSwitcher
                championships={switcherChampionships}
                currentSlug={championship.slug}
                triggerClassName="absolute left-full top-1/2 ml-1 -translate-y-1/2"
              />
            </p>
          </>
        )}
      </div>

      {/* "/" itself skips the tabs — it already has the header nav plus the
          switcher to get anywhere else; the trio is for Tabelle/Verlauf
          (either branch) and the Archiv overview to get back and across. */}
      {!isHome && (
        <div className="mb-6 flex items-center justify-center gap-4 text-sm">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.to || (tab.matchNested && pathname.startsWith(`${tab.to}/`));
            return isActive ? (
              <span key={tab.label} className="font-medium">
                {tab.label}
              </span>
            ) : (
              <Link key={tab.label} to={tab.to} prefetch="intent" className={tabLinkClass}>
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      <Outlet />
    </div>
  );
}
