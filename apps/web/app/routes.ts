import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// Route files mirror the URL tree: routes/public/* serves the root, routes/
// manager/* serves /manager. An underscore prefix marks a file that is not a
// page of its own — layouts, catch-alls, private components, and the endpoint
// routes in routes/_resources.
//
// Within each block: index first, then the dynamic section, then the static
// pages alphabetically, then the catch-all.
export default [
  layout("routes/public/_layout.tsx", [
    // Archiv spans all completed championships — it sits outside the
    // championship layout, which scopes everything to the current one.
    route("archiv", "routes/public/archiv/index.tsx"),
    route("archiv/:slug", "routes/public/archiv/detail.tsx"),
    route("login", "routes/public/login.tsx"),
    layout("routes/public/_championship-layout.tsx", [
      index("routes/public/index.tsx"),
      route("spiele", "routes/public/spiele/index.tsx"),
      route("spiele/:nr", "routes/public/spiele/detail.tsx"),
      route("tabelle", "routes/public/tabelle.tsx"),
      route("tipps/:slug?", "routes/public/tipps/index.tsx"),
      route("zusatzfragen", "routes/public/zusatzfragen/index.tsx"),
    ]),
    // Unmatched URLs render the 404 inside the public shell. Static siblings
    // (/manager, /logout, …) outrank the splat, so they are unaffected.
    route("*", "routes/public/_not-found.tsx"),
  ]),

  route("manager", "routes/manager/_layout.tsx", [
    index("routes/manager/index.tsx"),
    route(":slug", "routes/manager/championship/_layout.tsx", [
      index("routes/manager/championship/index.tsx"),
      route("ergebnisse/:nr?", "routes/manager/championship/ergebnisse.tsx"),
      route("spiele/:nr?", "routes/manager/championship/spiele.tsx"),
      route("tipps/:playerSlug?", "routes/manager/championship/tipps.tsx"),
      route("zusatzfragen", "routes/manager/championship/zusatzfragen.tsx"),
    ]),
    route("ligen", "routes/manager/ligen.tsx"),
    route("regelwerke", "routes/manager/regelwerke.tsx"),
    route("shell", "routes/_resources/manager-shell.tsx"),
    route("spieler", "routes/manager/spieler.tsx"),
    route("start", "routes/manager/start.tsx"),
    route("teams", "routes/manager/teams.tsx"),
    route("turniere", "routes/manager/turniere.tsx"),
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
