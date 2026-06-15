import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
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
  route("logout", "routes/logout.tsx"),
  route("color-scheme", "routes/color-scheme.tsx"),
] satisfies RouteConfig;
