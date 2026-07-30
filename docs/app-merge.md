# App Merge — Web into the RR8 App

**Status: decided 2026-07-30, starting immediately.** The TanStack Start web
app (`apps/web`) merges into the React Router 8 app (`apps/manager` becomes
the single app). Step 1 of the three-step sequence: **merge → Railway hosting
([railway-plan.md](./railway-plan.md)) → Turso→Litestream switch**.

## Why

- **Framework preference wins for a solo maintainer.** RR8's loader/action/
  form model is the preferred mental model; all future features (rules, chat,
  online tipping) get built once, in one framework, instead of split across
  two or built in Start and ported later.
- **The original TanStack-Start motivation (TanStack Query → fewer DB hits)
  has gotten weak** — the ranking is materialized now (cheap reads), the
  audience is ~15 users, and TanStack Query works inside RR8 anyway if a
  specific spot wants client-side caching (`ensureQueryData` in a loader,
  `useQuery` in components). Nothing is lost, it just stops being the default.
- **A whole class of cross-app complexity dissolves:** shared-cookie
  choreography, the manager→web login redirect (`WEB_APP_URL` /
  `web-app.server.ts`), two dev servers/ports, and the CF two-Workers +
  Routes + placeholder-DNS construction.

## Direction

The **RR8 app is the base** (it carries the mature patterns — per-row
fetchers, lock provider, middleware). Web routes port in at root; manager
routes move under a `/manager` path prefix.

- **Routing:** drop `basename: "/manager"`; manager routes become a
  `route("manager", …)` prefix with a role-gated layout. Public routes
  (Tabelle, Spieler/Tipps, Spiele, Archiv, Login) live at root.
- **Auth:** one root middleware resolves the session (optional, anonymous ok
  for public routes); the `/manager` layout middleware requires
  `manager`/`admin` role. The TOTP login flow ports from web's server
  functions to RR8 actions — same `auth.server.ts` logic, different wrapper.
- **Cleanups unlocked:** `assetsDir: "manager/assets"` hack → default;
  `WEB_APP_URL` env + `web-app.server.ts` → deleted (in-app redirects);
  `routeTree.gen.ts` and the TanStack Router memory-quirks retire with Start.
- **Porting inventory (mechanical, components carry over ~unchanged):** the
  route modules under `apps/web/src/routes` (championship layout + tabelle,
  tipps/{-$slug}, spiele + $nr, zusatzfragen, archiv, login, index
  dashboard), the shell per [web-shell.md](./web-shell.md) (unchanged spec,
  new host app), server functions → loaders/actions.
- **Env consolidation:** one `wrangler.jsonc` — web's vars (`TOTP_*`,
  `SESSION_*`, `FROM_EMAIL`, mail secret) join the manager's (`TURSO_*`).

## Deployment during/after the merge

Ships on the **current CF setup first** (no infra change): the merged app
deploys to the `tipprunde` Worker at the root route. Afterwards the
`tipprunde-manager` Worker, its `next.runde.tips/manager*` route, and (once
Routes are no longer needed) the placeholder DNS record can be deleted — a
single Worker could even go back to a plain Custom Domain. RR8 + CF vite
plugin is proven by the manager's current setup.

## Decisions (2026-07-30)

- **Name:** directory `apps/tipprunde`, package **`@tipprunde/app`**. Renamed
  only at the very end, after the old `apps/web` is deleted. The package name
  deliberately avoids `@tipprunde/tipprunde` — no scope stutter, and no
  `--filter` ambiguity with the root workspace package (`tipprunde`).
  Filter: `pnpm --filter app` (or `--filter ./apps/tipprunde`). Update
  Workers Builds config + CLAUDE.md files at rename time.
- **Data strategy: plain RR8 loaders, no TanStack Query.** Snappiness comes
  from `<Link prefetch="intent">` (loader data + route modules prefetched on
  hover/focus) plus `shouldRevalidate` to skip unchanged parent data. Query
  was dropped because it would split the app into two data patterns for a
  benefit imperceptible at this scale (small payloads, EU latency, DB
  becomes a local file in step 3). Decision is cheap to reverse: Query
  re-enters surgically if a specific route measurably needs client caching —
  at the latest with chat v1's `refetchInterval` polling
  ([chat-plan.md](./chat-plan.md)).
- **`packages/ui` stays a package.** Folding it app-local mid-port is churn
  for cosmetic gain; revisit only if the indirection ever annoys.
