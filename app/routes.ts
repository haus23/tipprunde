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
    route("login", "./routes/foh/(auth)/login.tsx"),
    route("verify", "./routes/foh/(auth)/verify.tsx"),
    route("logout", "./routes/foh/(auth)/logout.tsx"),
  ]),
  ...prefix("hinterhof", [
    layout("./routes/manager/_layout.tsx", [
      route(":championshipId?", "./routes/manager/dashboard.tsx"),
      route(":championshipId?/turnier", "./routes/manager/championship.tsx"),
      route(":championshipId?/spiele", "./routes/manager/matches.tsx"),
      // Domain routes
      ...prefix("stammdaten", [
        route("turniere", "./routes/manager/domain/championships/list.tsx"),
        route(
          "turniere/neu",
          "./routes/manager/domain/championships/create.tsx",
        ),
        route("spieler", "./routes/manager/domain/players/list.tsx"),
        route("spieler/neu", "./routes/manager/domain/players/create.tsx"),
        route("teams", "./routes/manager/domain/teams/list.tsx"),
        route("teams/neu", "./routes/manager/domain/teams/create.tsx"),
      ]),
    ]),
  ]),
  ...prefix("action", [
    route("set-settings", "./routes/actions/set-settings.ts"),
  ]),
] satisfies RouteConfig;
