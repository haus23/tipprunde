import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/foh/_layout.tsx", [
    index("./routes/foh/ranking.tsx"),
    route("spieler", "./routes/foh/players.tsx"),
    route("spiele", "./routes/foh/matches.tsx"),
  ]),
  ...prefix("action", [
    route("set-settings", "./routes/actions/set-settings.ts"),
  ]),
] satisfies RouteConfig;
