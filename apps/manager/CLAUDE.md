# CLAUDE.md

## Project description

This is the app behind https://runde.tips - the Haus23 Tipprunde. It is a React Router 8 Framework Mode application. Public routes live at the root, the management UI (championships, players, matches, teams, leagues, results, tips, rulesets) under `/manager`.

## Commands

All commands run from `apps/manager` (or root with `pnpm --filter @tipprunde/manager`):

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

- `root.tsx` — Document only (html/head, color scheme attribute, error boundary) + session middleware. No visible chrome.
- `routes/manager-layout.tsx` — The manager shell: sidebar, mobile nav, championship switcher, role gate + championship middleware
- `routes.ts` — Programmatic route config (RouteConfig)
- `lib/` — Server-only utilities: `session.server.ts`, `db.server.ts`, `championship.server.ts`, `cookies.server.ts`, `lock.server.ts`, `ranking.server.ts`, plus `context.ts`, `color-scheme.ts`, `utils.ts`
- `components/` — Reusable React Aria UI components (dialogs, inputs, sidebar, card, filter, etc.)
- `routes/` — Route handlers (loaders + actions + UI)

**Authentication:** DB-backed sessions (`sessions` table); the `__auth` cookie is a signed RR `createCookieSessionStorage` cookie carrying _only_ the session id, so sessions stay revocable server-side. `getSessionUser()` in `lib/session.server.ts` resolves the user (any role, or null) and runs as **root middleware** — anonymous is fine for public routes. The `/manager` layout adds the role gate on top: no user → redirect to `/login`, wrong role → 403.

**Route structure:**

Public routes live at the root; the manager sits under `/manager` (app merge in progress, see `docs/app-merge.md`).

- `/` — public placeholder (public routes port in during phase C)
- `/login` — placeholder (TOTP flow ports in during phase B2)
- `/color-scheme` — action-only, shared by both shells
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
- `/manager/logout`, `/manager/shell` — Action-only routes

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

## Docs

Shared docs are in the root `docs/` folder:

- `domain.md` — Domain model: championship/round feature flags, ruleset rule IDs, scoring chain logic, open design questions
- `theme.md` — Color system: Radix Sand/Orange tokens, `--color-*` CSS properties, Tailwind setup
- `tokens.md` — Design tokens for border-radius
- `deployment.md` — Environment variables, first-deploy bootstrap (manual admin user insert), user management

## Environment variables

Required in `.env` for local dev: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET`

## External Documentation (LLM-Ready)

- **React Aria Components**
  - High-level Index: https://react-aria.adobe.com/llms.txt
