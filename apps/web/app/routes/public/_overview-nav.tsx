import { hasExtraQuestions } from "@tipprunde/domain/ranking";
import { Link, Outlet, useLocation } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import { getRuleset } from "#/lib/championship.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_overview-nav";

const tabLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2";

/**
 * The rahmen around the table and what belongs to it — Zusatzfragen,
 * Regelwerk, Verlauf: title above, the tabs below, then whichever is active.
 * Mounted twice, same file each time: under /turnier and under
 * /turnier/:slug (see routes.ts). The table is the championship's own page,
 * so its tab points at the branch's basePath.
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const ruleset = await getRuleset(championship.id);
  return {
    championship: { name: championship.name, completed: championship.completed },
    // No tab for a championship whose ruleset asks no extra questions.
    showExtraQuestions: ruleset
      ? hasExtraQuestions({ extraQuestionRuleId: ruleset.extraQuestionRuleId })
      : false,
  };
}

export default function OverviewNav({ loaderData }: Route.ComponentProps) {
  const { championship, showExtraQuestions } = loaderData;
  const scoped = useScopedPath();
  const pathname = useLocation().pathname;

  const tabs = [
    // matchNested only on Verlauf: its own route carries an optional
    // trailing :playerSlug. The table's "to" is the branch's basePath, a
    // prefix of every other tab's path too — matching nested there would
    // wrongly mark it active from Verlauf or Regelwerk as well.
    {
      label: championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle",
      // Below xs the long name would push the fourth tab onto a line of its own.
      shortLabel: "Tabelle",
      to: scoped("/"),
      matchNested: false,
    },
    ...(showExtraQuestions
      ? [{ label: "Zusatzfragen", to: scoped("/zusatzfragen"), matchNested: false }]
      : []),
    { label: "Regelwerk", to: scoped("/regelwerk"), matchNested: false },
    { label: "Verlauf", to: scoped("/verlauf"), matchNested: true },
  ];

  const tabLabel = (tab: (typeof tabs)[number]) =>
    "shortLabel" in tab ? (
      <>
        <span className="xs:hidden">{tab.shortLabel}</span>
        <span className="xs:inline hidden">{tab.label}</span>
      </>
    ) : (
      tab.label
    );

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="poster-title poster-title-bar text-3xl">{championship.name}</h1>
      </div>

      {/* Wraps on narrow screens rather than squeezing four tabs into one
          line; padded like the prose below xs, where <main> has none. */}
      <div className="xs:px-0 mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 text-sm">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.to || (tab.matchNested && pathname.startsWith(`${tab.to}/`));
          return isActive ? (
            <span key={tab.label} className="font-medium">
              {tabLabel(tab)}
            </span>
          ) : (
            <Link key={tab.label} to={tab.to} prefetch="intent" className={tabLinkClass}>
              {tabLabel(tab)}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
