import { Link, Outlet, useLocation } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_overview-nav";

const tabLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2";

/**
 * The Übersicht/Tabelle/Verlauf trio's shared rahmen — title above, the
 * three tabs below, then whichever of the three is active. Mounted twice,
 * same file each time: under /turnier and under /turnier/:slug (see
 * routes.ts).
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  return {
    championship: { name: championship.name, completed: championship.completed },
  };
}

export default function OverviewNav({ loaderData }: Route.ComponentProps) {
  const { championship } = loaderData;
  const scoped = useScopedPath();
  const pathname = useLocation().pathname;

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
      <div className="mb-6 flex flex-col items-center">
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
      </div>

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

      <Outlet />
    </div>
  );
}
