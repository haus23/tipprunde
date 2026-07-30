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

## Open questions

- **Rename** `apps/manager` → `apps/app` (or similar) once it's the only app?
  (Affects workspace filters, Workers Builds config, CLAUDE.md files.)
- **Per-case data strategy:** plain RR loaders + revalidation as default;
  TanStack Query only where client-caching genuinely helps (e.g. chat
  polling, matchday popovers) — decide per feature, not globally.
- What of `packages/ui` remains shared vs. moves app-local once there is
  only one consumer (theme/domain/db stay packages regardless).
