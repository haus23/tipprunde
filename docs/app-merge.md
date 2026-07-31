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

## Port plan

### Inventory (what moves from `apps/web`)

- **Shell** (`__root/`): header (logo, nav, color-scheme menu, user area),
  navigation progress, root document, error boundary, not-found. Becomes the
  _public layout_ in the merged app.
- **Routes** (9 modules + co-located components): `_championship` layout
  (current published championship into context) with `index` (dashboard:
  standings/current-matches/archiv-preview/regelwerk), `tabelle`,
  `spiele.index`, `spiele.$nr`, `tipps.{-$slug}`, `zusatzfragen`; plus
  `archiv.index`, `archiv.$slug`, `login` (TOTP flow).
- **Lib** (12 files): `auth.server`/`auth`, `session`, `ranking`, `spiele`,
  `spieler`, `archiv`, `extra-questions`, `ruleset`, `color-scheme`,
  `format`; `db.server` already duplicates the manager's.
- **Components:** `ranking-table`, `cell-link`, `cell-flag`.

Findings from the inventory: **no path collisions** — public routes
(`/tabelle`, `/spiele`, `/tipps`, `/archiv`, `/login`) vs. manager routes
(`/manager/:slug/…`, `/manager/turniere`, …) are disjoint _once_ the
manager's root-level `:slug` route moves under the prefix. Duplicated
mechanisms that must **unify**: color-scheme (manager action route vs. web
server fn → one action route serving both shells), logout (same), session
lookup (`getSessionUser` vs. web's `session.ts` → one root middleware).

### Start → RR8 translation

| TanStack Start                    | RR8 equivalent                                                        |
| --------------------------------- | --------------------------------------------------------------------- |
| `createServerFn` (read)           | `loader`                                                              |
| `createServerFn` (mutation)       | `action` (or fetcher-target route)                                    |
| `beforeLoad` + router context     | middleware + `context` / loader data                                  |
| `createFileRoute` file convention | entry in `routes.ts` (config routing, as the manager does)            |
| `head()` / `pageTitle`            | inline `<title>` JSX (React 19 hoisting — manager's existing pattern) |
| `router.invalidate()`             | automatic revalidation after actions                                  |
| typed `<Link to>`                 | RR `<Link>` (+ `href()` helper where wanted) with `prefetch="intent"` |
| `routeTree.gen.ts`                | gone (config routing)                                                 |

### Layout structure: one document, two shells

The two apps have **deliberately different shells, and they stay different** —
no unification attempt. What today is spread across two root files becomes a
three-level route structure:

- **Root route — document only.** `<html>`/`<head>`, color-scheme attribute
  from the cookie, the merged `app.css`, root error boundary + 404. No
  visible chrome. (Today this lives twice: web's `-root-document.tsx` and
  the manager's `root.tsx`.)
- **Public layout (pathless).** Web's header shell moves here as-is: logo,
  top nav (Tabelle · Spieler · Spiele), color-scheme menu, user area,
  navigation progress, `max-w-4xl` container. Wraps all public routes
  including `/login`. The future chat rail ([web-shell.md](./web-shell.md))
  attaches to _this_ shell only.
- **Manager layout (`/manager`).** Everything the manager's `root.tsx` does
  today _except_ the document: `ShellProvider`, sidebar + mobile nav,
  championship switcher header, and the role-gating middleware. The
  sidebar-collapse cookie action (`manager-shell`) stays scoped under the
  prefix.

The shells share only the document and the color-scheme mechanism. One merge
task falls out of this: both apps have their own `app.css` importing
`@tipprunde/theme` — consolidate into a single stylesheet and reconcile any
app-local additions.

### Step plan (commit-sized, on branch `app-merge`)

Work happens **on a branch** — main keeps deploying the untouched two-app
setup, so live data entry on `next.runde.tips` is never disturbed. Rule
changes landing on main meanwhile → rebase. Workers Builds branch previews
(on the manager Worker's project) give a shareable preview URL per push.
Auth is ported _early_ (step B) because the preview runs on its own domain —
no existing cookie — and without in-app login the manager routes would be
unreachable in previews.

**Phase A — skeleton (public "/" appears):**

- **A1** — Move all manager routes under `route("manager", …)`; drop
  `basename` + `assetsDir`; split `root.tsx` into a chrome-less document
  root and a manager layout (shell + auth middleware move there);
  placeholder page at `/` (public, no auth).
- **A2** — Color-scheme unification: the manager's action route + cookie
  moves to root level, serving both shells.

**Phase B — auth (previews become fully usable):**

- **B1** — Session middleware split: root middleware resolves the session
  _optionally_ (anonymous fine); manager layout middleware requires
  `manager`/`admin` and redirects to the in-app `/login` (replaces the
  `WEB_APP_URL` redirect). Sessions stay **DB-backed** (`sessions` table,
  revocable), but the cookie moves to RR's `createCookieSessionStorage`
  holding _only the session id_ — signed (integrity, not encryption), the
  idiomatic RR session API. New `SESSION_SECRET` secret; the hand-rolled
  `cookies.server.ts` retires. Cookie format changes → one-time re-login
  for existing sessions at cutover (acceptable at this user count).
- **B2** — Port the TOTP login flow (login route + request/verify/start-over
  actions, `auth.server` logic) and unify `/logout`. The `__pending_auth`
  cookie may fold into the same session object (decide at implementation).
  Env prerequisite: the web app's vars/secrets (`TOTP_*`, `SESSION_*`,
  `FROM_EMAIL`, mail secret) plus `SESSION_SECRET` must exist on the manager
  Worker so branch previews can send login mails.

**Phase C — public routes, simplest first (one commit each, verified in
preview):**

- **C1** — Public shell layout: header, nav, user area, color-scheme menu,
  navigation progress, error/404; `app.css` consolidation lands here.
- **C2** — Championship layout + `tabelle` (proves RankingTable, cell-link,
  cell-flag, championship context).
- **C3** — `spiele` (index + `$nr` match view).
- **C4** — `tipps.{-$slug}` (player view).
- **C5** — `zusatzfragen`.
- **C6** — Dashboard `index` (replaces the placeholder at `/`).
- **C7** — `archiv` (index + `$slug`).

**Phase D — cutover & rename (one sitting):**

- **D1** — Parity checklist walk (below); final env consolidation on the
  surviving `tipprunde` Worker (add `TURSO_*` secrets; wrangler `name` →
  `tipprunde`).
- **D2** — Delete old `apps/web`; rename `apps/manager` → `apps/web`,
  package → `@tipprunde/web`; merge branch into main.
- **D3** — CF: point the `tipprunde` Worker's build at the merged app
  (barely changes — `--filter web` + `dist/server/wrangler.json` still fit);
  delete the `tipprunde-manager` Worker + `/manager*` route; optionally
  revert `next.runde.tips` to a plain Custom Domain and drop the placeholder
  DNS record.
- **D4** — Housekeeping: CLAUDE.md files, `.claude/launch.json`, docs,
  memory.

### Parity checklist (cutover requires all)

- [ ] All public URLs unchanged: `/`, `/tabelle`, `/spiele/:nr?`,
      `/tipps/:slug?`, `/zusatzfragen`, `/archiv`, `/archiv/:slug`, `/login`
- [ ] TOTP login + logout work in-app; `__auth` cookie unchanged
- [ ] Manager fully functional under `/manager` (locks, per-row fetchers,
      bulk paste — no regressions)
- [ ] Color scheme persists and applies across both shells
- [ ] Error boundary + 404 behave like today
- [ ] `next.runde.tips` serves the merged app from the single Worker

## Decisions (2026-07-30, naming revised 2026-08)

- **Name (revised):** directory `apps/web`, package **`@tipprunde/web`** —
  the merged app takes over the retiring app's identity. Because those names
  are occupied until the old app is deleted, the rename is necessarily the
  _last_ step; during the port the code stays in `apps/manager`. Nice side
  effect: the surviving `tipprunde` Worker already builds with
  `--filter web` and deploys `dist/server/wrangler.json`, so its build
  config barely changes at cutover.
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
