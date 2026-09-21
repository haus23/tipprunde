import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// Route files mirror the URL tree: routes/public/* serves the root, routes/
// manager/* serves /manager. An underscore prefix marks a file that is not a
// page of its own — layouts, catch-alls, private components, and the endpoint
// routes in routes/_resources.
//
// Within each block: index first, then the dynamic section, then the static
// pages alphabetically, then the catch-all.

/**
 * The championship-scoped public views that sit outside the Übersicht/
 * Tabelle/Verlauf trio (see `overviewNav` below), mounted **three times**:
 * once for the running championship at the root, once for it again under
 * /turnier, once per published championship under /turnier/:slug.
 *
 * Same files every time — only the `id` differs, which is what lets React
 * Router mount one module at several places. The views read the championship
 * from `viewedChampionshipContext` and never learn which branch rendered
 * them, so a new public feature is written once and appears everywhere.
 *
 * See docs/decisions/05-championship-scope.md and
 * docs/decisions/11-turnier-stadionsenf-routing.md.
 */
const championshipViews = (id: string) => [
  route("regelwerk", "routes/public/championship/regelwerk.tsx", { id: `${id}-regelwerk` }),
  route("spiele", "routes/public/championship/spiele/index.tsx", { id: `${id}-spiele` }),
  route("spiele/:nr", "routes/public/championship/spiele/detail.tsx", { id: `${id}-match` }),
  // :playerSlug, not :slug — under /turnier/:slug the parent already owns
  // `slug`, and an unmatched optional child param does not shadow it.
  route("tipps/:playerSlug?", "routes/public/championship/tipps/index.tsx", {
    id: `${id}-tipps`,
  }),
  route("zusatzfragen", "routes/public/championship/zusatzfragen/index.tsx", {
    id: `${id}-zusatzfragen`,
  }),
];

// Tabelle and Verlauf, the two views `_overview-nav.tsx` wraps alongside the
// index (see there) — split out so the root branch can mount them separately
// from the index (inside the season chrome, unlike the index itself).
const overviewSiblingViews = (id: string) => [
  route("tabelle", "routes/public/championship/tabelle.tsx", { id: `${id}-tabelle` }),
  // :playerSlug only picks the highlighted line — see docs/decisions/06-verlauf-bump-chart.md.
  route("verlauf/:playerSlug?", "routes/public/championship/verlauf/index.tsx", {
    id: `${id}-verlauf`,
  }),
];

export default [
  layout("routes/public/_layout.tsx", [
    // Archiv spans all championships — the index (list + Ewige Tabelle) sits
    // outside any championship scope. Per-championship views live under
    // /turnier below, not here — see docs/decisions/11-turnier-stadionsenf-routing.md
    // for why the two were merged into one family.
    route("archiv", "routes/public/archiv/index.tsx"),
    route("login", "routes/public/login.tsx"),
    route("stadionsenf", "routes/public/stadionsenf/index.tsx"),
    route("stadionsenf/:slug", "routes/public/stadionsenf/detail.tsx"),
    layout("routes/public/_championship-layout.tsx", [
      // "/" keeps the site's own identity and switcher — no season-chrome
      // bar, but still the Übersicht/Tabelle/Verlauf rahmen (its own mount,
      // since Tabelle/Verlauf below need the chrome this one doesn't). This
      // is the one place that still gets to be different — /turnier below
      // (same running championship, different URL) does not.
      layout("routes/public/_overview-nav.tsx", { id: "current-index-overview" }, [
        index("routes/public/championship/index.tsx", { id: "current-index" }),
      ]),
      layout("routes/public/_championship-chrome.tsx", { id: "current-chrome" }, [
        layout("routes/public/_overview-nav.tsx", { id: "current-overview" }, [
          ...overviewSiblingViews("current"),
        ]),
        ...championshipViews("current"),
      ]),
    ]),
    // The running championship again, at its forward-looking canonical URL —
    // structurally identical to /turnier/:slug below (chrome wraps the index
    // too, no carve-out), unlike "/" above. Transitional duplicate of "/"
    // until the real homepage replaces "/"'s content — see
    // docs/decisions/11-turnier-stadionsenf-routing.md.
    route("turnier", "routes/public/_championship-layout.tsx", { id: "turnier-layout" }, [
      layout("routes/public/_championship-chrome.tsx", { id: "turnier-chrome" }, [
        layout("routes/public/_overview-nav.tsx", { id: "turnier-overview" }, [
          index("routes/public/championship/index.tsx", { id: "turnier-index" }),
          ...overviewSiblingViews("turnier"),
        ]),
        ...championshipViews("turnier"),
      ]),
    ]),
    // Any published championship by slug — replaces the old
    // /archiv/turnier/:slug. Every championship's URL is now stable from the
    // moment it is published, current or archived alike; see
    // docs/decisions/11-turnier-stadionsenf-routing.md.
    route("turnier/:slug", "routes/public/turnier/_layout.tsx", [
      layout("routes/public/_championship-chrome.tsx", { id: "archiv-chrome" }, [
        layout("routes/public/_overview-nav.tsx", { id: "archiv-overview" }, [
          index("routes/public/championship/index.tsx", { id: "archiv-index" }),
          ...overviewSiblingViews("archiv"),
        ]),
        ...championshipViews("archiv"),
      ]),
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
