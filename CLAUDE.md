# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspace with currently a single app at `apps/web` (SvelteKit). A `packages/` directory is reserved but currently empty. All development work happens currently inside `apps/web`.

Related agent instructions:
@apps/web/CLAUDE.md

## Commands

All commands run from `apps/web` (or root with `pnpm --filter @tipprunde/web`):

```bash
pnpm dev          # Start dev server (vite-plus)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm exec svelte-check  # Type-check Svelte files
```

Database commands:
There are currently no commands for managing the database. That happens in another project.
The SvelteKit app is just reading the db with drizzle-orm. No drizzle-kit setup.

Release (from repo root):

```bash
# Patch version change: 0.1.2 -> 0.1.3  (It's a minor release arg due to major version 0)
bunx changelogen --noAuthors --release --minor --push
# Minor version change: 0.1.2 -> 0.2.0  (It's a major release arg due to major version 0)
bunx changelogen --noAuthors --release --major --push
```

## Architecture

**Stack:** SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + Drizzle ORM + Turso (libSQL/SQLite) + Vercel adapter

**Database layer** (`src/lib/server/db/`):

- `schema.ts` — Drizzle table definitions (SQLite). Core entities: `users`, `sessions`, `totpCodes`, `championships`, `rounds`, `matches`, `teams`, `leagues`, `tips`, `players`, `rulesets`
- `relations.ts` — Drizzle RQB v2 relations via `defineRelations`
- `index.ts` — DB client (Turso via `drizzle-orm/libsql/web`), re-exports schema
- `auth.ts`, `matches.ts`, `ranking.ts` — use-case-specific query functions (no speculative helpers)

**Authentication:** Email-based TOTP flow. `hooks.server.ts` validates the `__auth` session cookie and populates `locals.user`. Login uses a two-step form: email → 6-digit code (sent via Resend API). Sessions stored in DB with configurable durations via env vars.

**Route structure:**

- `/` — Dashboard: top-3 ranking + current matches (logged-in user's position highlighted)
- `/tabelle` — Full ranking for the current championship
- `/spieler/[[slug]]` — Player view
- `/spiele` — All rounds/matches overview
- `/spiele/[nr]` — Single match detail
- `/login`, `/logout` — Auth routes

The root layout (`+layout.server.ts`) loads the latest published championship and passes it + `locals.user` to all child routes via `parent()`.

**Domain rules** (`src/lib/domain/rules.ts`): Constants for scoring rule variants (tip rules, joker rules, match rules, etc.) referenced by the `rulesets` table.

**UI aliases:**

- `$ui/*` → `src/lib/ui/*` (shared Svelte components)
- Standard SvelteKit `$lib` alias applies

## Code style

- Double quotes in all TypeScript/Svelte files (oxfmt formatter — user formats after writing)
- Drizzle RQB v2 query syntax: object shorthand in `where` with operators (`in`, `gt`, `isNotNull`, etc.) — do not use v1 callback form
- Only create DAL query functions when a concrete use case exists — no speculative helpers
- TypeScript 6.0 subpath imports (`#/`) resolve natively; no tsconfig paths needed

## Environment variables

Required in `.env` for local dev: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `APP_SECRET`, `RESEND_API_KEY`, `FROM_EMAIL`, `TOTP_EXPIRES_IN`, `TOTP_MAX_ATTEMPTS`, `SESSION_DURATION_DEFAULT`, `SESSION_DURATION_REMEMBER`

## UI Development

- Use bits-ui where appropriate
- Only use color tokens from the `src/routes/layout.css`. Or create new tokens if needed. The design system uses an orange/sand palette from RadixUI colors. That colors are listed in the comments.

## External Documentation (LLM-Ready)

- **bits-ui**
  - High-level Index: https://bits-ui.com/llms.txt
  - Full Doc: bits-ui.com/docs/llms.txt
  - _Usage Note:_ Fetch the full doc only when deep API details or complex code examples are required.
