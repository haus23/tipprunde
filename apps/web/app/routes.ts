import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// Route files mirror the URL tree: routes/public/* serves the root, routes/
// manager/* serves /manager. An underscore prefix marks a file that is not a
// page of its own — layouts, catch-alls, private components, and the endpoint
// routes in routes/_resources.
//
// Within each block: index first, then the dynamic section, then the static
// pages alphabetically, then the catch-all.

/**
 * The championship-scoped public views, mounted **twice**: once for the running
 * championship at the root, once per archived championship under
 * /archiv/turnier/:slug.
 *
 * Same files both times — only the `id` differs, which is what lets React
 * Router mount one module at two places. The views read the championship from
 * `viewedChampionshipContext` and never learn which branch rendered them, so a
 * new public feature is written once and appears in both.
 *
 * The index view (the championship overview) is deliberately **not** in this
 * list — each branch mounts it itself, since only the running one needs it
 * pulled out from under `_championship-chrome.tsx` (see below).
 *
 * See docs/decisions/05-championship-scope.md.
 */
const championshipViews = (id: string) => [
  route("regelwerk", "routes/public/championship/regelwerk.tsx", { id: `${id}-regelwerk` }),
  route("spiele", "routes/public/championship/spiele/index.tsx", { id: `${id}-spiele` }),
  route("spiele/:nr", "routes/public/championship/spiele/detail.tsx", { id: `${id}-match` }),
  route("tabelle", "routes/public/championship/tabelle.tsx", { id: `${id}-tabelle` }),
  // :playerSlug, not :slug — under /archiv/turnier/:slug the parent already
  // owns `slug`, and an unmatched optional child param does not shadow it.
  route("tipps/:playerSlug?", "routes/public/championship/tipps/index.tsx", {
    id: `${id}-tipps`,
  }),
  // :playerSlug only picks the highlighted line — see docs/decisions/06-verlauf-bump-chart.md.
  route("verlauf/:playerSlug?", "routes/public/championship/verlauf/index.tsx", {
    id: `${id}-verlauf`,
  }),
  route("zusatzfragen", "routes/public/championship/zusatzfragen/index.tsx", {
    id: `${id}-zusatzfragen`,
  }),
];

export default [
  layout("routes/public/_layout.tsx", [
    // Archiv spans all championships — the index (list + Ewige Tabelle) sits
    // outside any championship scope; turnier/:slug below opens one. The
    // "turnier" segment reserves the rest of /archiv/* for siblings that
    // aren't a championship slug (e.g. a future /archiv/spieler/:playerSlug).
    route("archiv", "routes/public/archiv/index.tsx"),
    route("archiv/turnier/:slug", "routes/public/archiv/_layout.tsx", [
      // Unlike the running championship, an archived one has no competing
      // "homepage" identity at its own index URL — so its overview sits
      // inside the chrome along with the other six views, not carved out.
      layout("routes/public/_championship-chrome.tsx", { id: "archiv-chrome" }, [
        index("routes/public/championship/index.tsx", { id: "archiv-index" }),
        ...championshipViews("archiv"),
      ]),
    ]),
    route("login", "routes/public/login.tsx"),
    layout("routes/public/_championship-layout.tsx", [
      // "/" keeps the site's own identity and switcher — no season-chrome bar.
      index("routes/public/championship/index.tsx", { id: "current-index" }),
      layout(
        "routes/public/_championship-chrome.tsx",
        { id: "current-chrome" },
        championshipViews("current"),
      ),
    ]),
    // Unmatched URLs render the 404 inside the public shell. Static siblings
    // (/manager, /logout, …) outrank the splat, so they are unaffected.
    route("*", "routes/public/_not-found.tsx"),
  ]),

  route("manager", "routes/manager/_layout.tsx", [
    // Pathless — carries the ErrorBoundary for the manager's own pages so an
    // error keeps the shell. The championship subtree and the catch-all below
    // bring their own; the endpoint has no UI to preserve.
    layout("routes/manager/_error-boundary.tsx", [
      index("routes/manager/index.tsx"),
      // Admin-only, see import.tsx's own gate. Championship-agnostic — the
      // page itself picks which open championship an import lands in.
      route("import", "routes/manager/import.tsx"),
      route("ligen", "routes/manager/ligen.tsx"),
      route("regelwerke", "routes/manager/regelwerke.tsx"),
      // Admin-only, see sicherheit.tsx's own gate.
      route("sicherheit", "routes/manager/sicherheit.tsx"),
      route("spieler", "routes/manager/spieler.tsx"),
      route("start", "routes/manager/start.tsx"),
      route("teams", "routes/manager/teams.tsx"),
      route("turniere", "routes/manager/turniere.tsx"),
    ]),
    route(":slug", "routes/manager/championship/_layout.tsx", [
      index("routes/manager/championship/index.tsx"),
      route("ergebnisse/:nr?", "routes/manager/championship/ergebnisse.tsx"),
      route("spiele/:nr?", "routes/manager/championship/spiele.tsx"),
      route("tipps/:playerSlug?", "routes/manager/championship/tipps.tsx"),
      route("zusatzfragen", "routes/manager/championship/zusatzfragen.tsx"),
    ]),
    route("shell", "routes/_resources/manager-shell.tsx"),
    // Outranks the public splat, so /manager typos keep the manager shell.
    route("*", "routes/manager/_not-found.tsx"),
  ]),

  // Endpoints: no UI, targeted by forms and fetchers. `logout` and
  // `color-scheme` are shared by both shells — logout must stay reachable for
  // plain players, who never get past the manager's role gate.
  route("color-scheme", "routes/_resources/color-scheme.tsx"),
  route("logout", "routes/_resources/logout.tsx"),
  route("matchday-tips/:userId", "routes/_resources/matchday-tips.tsx"),
] satisfies RouteConfig;
