import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(":slug", "routes/championship.tsx", [
    index("routes/championship/index.tsx"),
    route("spiele", "routes/championship/spiele.tsx"),
    route("tipps", "routes/championship/tipps.tsx"),
    route("ergebnisse", "routes/championship/ergebnisse.tsx"),
  ]),
  route("turniere", "routes/turniere.tsx"),
  route("spieler", "routes/spieler.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
