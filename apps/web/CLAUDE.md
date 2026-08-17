# CLAUDE.md

## Project description

This is the app behind https://runde.tips - the Haus23 Tipprunde. It is a React Router 8 Framework Mode application. Public routes live at the root, the management UI (championships, players, matches, teams, leagues, results, tips, rulesets) under `/manager`.

## Commands

All commands run from `apps/web` (or root with `pnpm --filter web`):

```bash
pnpm dev          # Start dev server (vite-plus)
pnpm build        # Build for production
pnpm typecheck    # Type-check files
```

Database commands:
There are currently no commands for managing the database. That happens in another project.
This app reads and writes the DB with drizzle-orm. No drizzle-kit setup here.

## Architecture

**Stack:** React Router 8 (Framework Mode) + React Aria Components + Tailwind CSS 4 + Drizzle ORM + Turso (libSQL/SQLite) + Cloudflare Workers

**App directory layout (`app/`):**

- `root.tsx` — Document only (html/head, color scheme attribute, last-resort error boundary) + session middleware. No visible chrome.
- `routes.ts` — Programmatic route config (RouteConfig). The folder mirrors the URL tree: `routes/public/*` serves the root, `routes/manager/*` serves `/manager`, and `routes/_resources/*` holds the endpoint routes (no UI, targeted by forms and fetchers)
- An `_` prefix marks a file that is **not a page of its own** — `_layout.tsx`, `_not-found.tsx`, and co-located private components like `spiele/_match-switch.tsx`. Anything without it is a URL you can visit
- `routes/public/_layout.tsx` — The public shell: header, nav, color-scheme toggle, user area; its `ErrorBoundary` renders 404s inside the shell
- `routes/manager/_layout.tsx` — The manager shell: sidebar, mobile nav, championship switcher, role gate + championship middleware
- `lib/` — Server-only utilities (`*.server.ts`): `session`, `db`, `championship` (incl. `getRuleset`), `cookies`, `lock`, `ranking`, plus the per-view query modules `archiv`, `spiele`, `spieler`, `extra-questions`. Isomorphic: `context.ts`, `color-scheme.ts`, `utils.ts`. Kept as the one place showing every DB touchpoint — query modules stay here even when a single route uses them; the TOTP flow is not a query module and lives beside `/login`
- `components/` — Only components used from **more than one route folder**. Anything used by a single route (or only by its layout) lives beside it as an `_`-prefixed file; generic primitives with no app/router/domain imports belong in `@tipprunde/ui`
- `routes/` — Route handlers (loaders + actions + UI)

**Authentication:** DB-backed sessions (`sessions` table); the `__auth` cookie is a signed RR `createCookieSessionStorage` cookie carrying _only_ the session id, so sessions stay revocable server-side. `getSessionUser()` in `lib/session.server.ts` resolves the user (any role, or null) and runs as **root middleware** — anonymous is fine for public routes. The `/manager` layout adds the role gate on top: no user → redirect to `/login`, wrong role → 403.

**Route structure:**

Public routes live at the root; the manager sits under `/manager`.

- `/` — Dashboard: standings, current matches, ruleset, Archiv preview
- `/tabelle` — Current/final table of the published championship
- `/spiele`, `/spiele/:nr` — Match overview (accordion) and per-match tips
- `/tipps/:slug?` — One player's tips (defaults to self, else rank 1)
- `/zusatzfragen` — Extra questions and answers
- `/archiv`, `/archiv/:slug` — Completed championships + all-time table
- `/login` — TOTP login (two steps, intent-based action)
- `/color-scheme`, `/logout` — action-only, shared by both shells
- `/matchday-tips/:userId` — Resource route for the ranking table's popover
- `/manager` → redirects to latest championship or `/manager/start`
- `/manager/start` — Onboarding (guides through initial ruleset setup)
- `/manager/:slug` — Championship parent route (validates slug, sets championship context)
- `/manager/:slug` (index) — Tournament overview: flags, rounds, enrolled players
- `/manager/:slug/spiele/:nr?` — Match management
- `/manager/:slug/tipps/:nr?` — Tip entry grid
- `/manager/:slug/ergebnisse/:nr?` — Result entry and auto-scoring
- `/manager/:slug/zusatzfragen` — Bonus/extra question points
- `/manager/turniere` — Championship master data (CRUD)
- `/manager/spieler` — User management (players, managers, admins)
- `/manager/teams` — Team master data
- `/manager/ligen` — League master data
- `/manager/regelwerke` — Ruleset master data
- `/manager/shell` — Action-only route (sidebar collapse cookie)
- `/manager/*` — Catch-all rendering the 404 inside the manager shell

**Database layer** (`app/lib/db.server.ts`):

- Turso LibSQL via `drizzle()`, credentials from env vars
- Imports schema + relations from `@tipprunde/db` package
- Uses Drizzle RQB v2 syntax: object shorthand in `where` with operators (`eq`, `and`, `max`, etc.) — do not use v1 callback form
- No speculative query helpers — write queries inline or in `lib/*.server.ts` only when a concrete use case exists

**Form & mutation pattern:**

- All mutations use `useFetcher()` — no full-page navigation
- Server-side validation via **Valibot** schemas (often derived from drizzle insert schemas)
- Actions return `{ errors: Record<string, string[]> }` on failure or the updated entity on success
- React Router auto-revalidates loaders after successful actions

## Code style

- Double quotes in all TypeScript/TSX files (oxfmt formatter — user formats after writing)
- Use `cn()` from `app/lib/utils.ts` for merging Tailwind classes; group classes semantically
- All Tailwind default colors are disabled — use only `--color-*` tokens from `app/app.css` (Radix Sand + Orange palette)
- German locale (`de-DE`) is hardcoded via `I18nProvider`; use `formatDate()` / `slugify()` from `app/lib/utils.ts`
- Middleware is default behaviour in RR8 (the `v8_*` future flags are gone); `context` is a `RouterContextProvider`
- One fetcher per independently-savable row — never share a `useFetcher()` across a list (see `docs/app-merge.md` history and the grid routes)
- Errors that should **render** are thrown from a loader, never from middleware — a `data()` thrown in middleware short-circuits as a raw response body and never reaches an `ErrorBoundary`. `redirect()` from middleware is fine.
- Mount an `ErrorBoundary` on a **child** route, not on the layout whose chrome should survive the error — a layout-level boundary replaces that layout. Public 404s go through `public/_layout.tsx` + the `*` route, manager 404s through `manager/_not-found.tsx` and `manager/championship/_layout.tsx`.

## Docs

Shared docs are in the root `docs/` folder:

- `domain.md` — Domain model: championship/round feature flags, ruleset rule IDs, scoring chain logic
- `theme.md` — Color system: Radix Sand/Orange tokens, `--color-*` CSS properties, Tailwind setup
- `tokens.md` — Design tokens: breakpoints, easing, shadows, border-radius, typography scale
- `deployment.md` — Environment variables (full table), first-deploy bootstrap (manual admin user insert), user management
- `web-shell.md` — Public shell: header contents, nav strategy, planned chat panel
- `color-scheme.md` — Single-button light/dark switch spec (replaces both current controls)
- `archiv.md` — Archiv: the materialized ranking columns on `players` and what depends on them
- `championship-scope-plan.md` — Public-routing change: championship as a URL dimension, shared route files for Archiv + current season, dashboard as the shared overview (designed, not started)
- `app-merge.md` — History: how this app absorbed the separate web app (why things look the way they do)

## Environment variables

All of these belong in `apps/web/.env` for local dev — the TOTP login needs the
mail and code settings, not just the DB:

`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET`, `APP_SECRET`,
`RESEND_API_KEY`, `FROM_EMAIL`, `TOTP_EXPIRES_IN`, `TOTP_MAX_ATTEMPTS`,
`SESSION_DURATION_DEFAULT`, `SESSION_DURATION_REMEMBER`

In production the first five are Worker **secrets** and the rest are `vars` in
`wrangler.jsonc`, which also lists them in `secrets.required` so a deploy fails
by name when one is missing. See `docs/deployment.md`.

## External Documentation (LLM-Ready)

- **React Aria Components**
  - High-level Index: https://react-aria.adobe.com/llms.txt
