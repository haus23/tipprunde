import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/foh/_index.tsx"),
  route("/spieler", "routes/foh/players.tsx"),
  route("/spiele", "routes/foh/matches.tsx"),
  ...prefix("action", [
    route("set-theme", "routes/(action)/set-theme.ts"),
  ]),
] satisfies RouteConfig;
