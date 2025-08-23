import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/foh/_index.tsx"),
  route("/spieler", "routes/foh/players.tsx"),
  route("/spiele", "routes/foh/matches.tsx"),
] satisfies RouteConfig;
