# CLAUDE.md

## Project description

This is the backend management app for https://runde.tips - the Haus23 Tipprunde. It is a React Router 7 Framework Mode application for managing championships, players, matches, teams, leagues, results, tips, and rulesets.

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

**Stack:** React Router 7 (Framework Mode) + React Aria Components + Tailwind CSS 4 + Drizzle ORM + Turso (libSQL/SQLite) + Vercel adapter

**App directory layout (`app/`):**

- `root.tsx` — Root layout with auth + championship middleware, error boundary, color scheme toggle
- `routes.ts` — Programmatic route config (RouteConfig)
- `lib/` — Server-only utilities: `auth.server.ts`, `db.server.ts`, `championship.server.ts`, `cookies.server.ts`, `context.ts`, `utils.ts`, `web-app.server.ts`
- `components/` — Reusable React Aria UI components (dialogs, inputs, sidebar, card, filter, etc.)
- `routes/` — Route handlers (loaders + actions + UI)

**Authentication:** Session-based via `__auth` cookie. The frontend app handles TOTP login and sets the cookie. `getSessionUser()` in `lib/auth.server.ts` validates the session on every request (checks expiry, requires `manager` or `admin` role). Auth runs as root middleware in `root.tsx` — unauthenticated requests redirect to the frontend login.

**Route structure:**

- `/` → redirects to latest championship or `/start`
- `/start` — Onboarding (guides through initial ruleset setup)
- `/:slug` — Championship parent route (validates slug, sets championship context)
- `/:slug` (index) — Tournament overview: flags, rounds, enrolled players
- `/:slug/spiele/:nr?` — Match management
- `/:slug/tipps/:nr?` — Tip entry grid
- `/:slug/ergebnisse/:nr?` — Result entry and auto-scoring
- `/:slug/zusatzpunkte` — Bonus/extra question points
- `/turniere` — Championship master data (CRUD)
- `/spieler` — User management (players, managers, admins)
- `/teams` — Team master data
- `/ligen` — League master data
- `/regelwerke` — Ruleset master data
- `/logout`, `/color-scheme` — Action-only routes

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
- React Router v7 middleware is enabled via the `v8_middleware: true` future flag

## Docs

Shared docs are in the root `docs/` folder:

- `domain.md` — Domain model: championship/round feature flags, ruleset rule IDs, scoring chain logic, open design questions
- `theme.md` — Color system: Radix Sand/Orange tokens, `--color-*` CSS properties, Tailwind setup
- `tokens.md` — Design tokens for border-radius
- `deployment.md` — Environment variables, first-deploy bootstrap (manual admin user insert), user management

## Environment variables

Required in `.env` for local dev: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `WEB_APP_URL`

## External Documentation (LLM-Ready)

- **React Aria Components**
  - High-level Index: https://react-aria.adobe.com/llms.txt
