import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/public-layout.tsx", [
    route("login", "routes/login.tsx"),
    // Archiv spans all completed championships — it sits outside the
    // championship layout, which scopes everything to the current one.
    route("archiv", "routes/public/archiv/index.tsx"),
    route("archiv/:slug", "routes/public/archiv/detail.tsx"),
    layout("routes/public/championship-layout.tsx", [
      index("routes/public/dashboard/index.tsx"),
      route("tabelle", "routes/public/tabelle.tsx"),
      route("spiele", "routes/public/spiele/index.tsx"),
      route("spiele/:nr", "routes/public/spiele/detail.tsx"),
      route("tipps/:slug?", "routes/public/tipps/index.tsx"),
      route("zusatzfragen", "routes/public/zusatzfragen/index.tsx"),
    ]),
    // Unmatched URLs render the 404 inside the public shell. Static siblings
    // (/manager, /logout, …) outrank the splat, so they are unaffected.
    route("*", "routes/public/not-found.tsx"),
  ]),
  // Resource route for the ranking table's per-player popover.
  route("matchday-tips/:userId", "routes/matchday-tips.tsx"),
  // Action-only, and shared by both shells — logout must stay reachable for
  // plain players, who never get past the manager's role gate.
  route("logout", "routes/logout.tsx"),
  route("color-scheme", "routes/color-scheme.tsx"),
  route("manager", "routes/manager-layout.tsx", [
    index("routes/index.tsx"),
    route(":slug", "routes/championship.tsx", [
      index("routes/championship/index.tsx"),
      route("spiele/:nr?", "routes/championship/spiele.tsx"),
      route("tipps/:playerSlug?", "routes/championship/tipps.tsx"),
      route("ergebnisse/:nr?", "routes/championship/ergebnisse.tsx"),
      route("zusatzfragen", "routes/championship/zusatzfragen.tsx"),
    ]),
    route("start", "routes/start.tsx"),
    route("turniere", "routes/turniere.tsx"),
    route("spieler", "routes/spieler.tsx"),
    route("teams", "routes/teams.tsx"),
    route("ligen", "routes/ligen.tsx"),
    route("regelwerke", "routes/regelwerke.tsx"),
    route("shell", "routes/manager-shell.tsx"),
  ]),
] satisfies RouteConfig;
