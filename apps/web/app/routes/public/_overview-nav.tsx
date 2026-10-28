import { Link, Outlet, useLocation } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_overview-nav";

const tabLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2";

/**
 * The Tabelle/Verlauf/Regelwerk trio's shared rahmen — title above, the
 * three tabs below, then whichever of the three is active. Mounted twice,
 * same file each time: under /turnier and under /turnier/:slug (see
 * routes.ts). The table is the championship's own page, so its tab points
 * at the branch's basePath.
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
    // trailing :playerSlug. The table's "to" is the branch's basePath, a
    // prefix of every other tab's path too — matching nested there would
    // wrongly mark it active from Verlauf or Regelwerk as well.
    {
      label: championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle",
      to: scoped("/"),
      matchNested: false,
    },
    { label: "Verlauf", to: scoped("/verlauf"), matchNested: true },
    { label: "Regelwerk", to: scoped("/regelwerk"), matchNested: false },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="poster-title poster-title-bar text-3xl">{championship.name}</h1>
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
