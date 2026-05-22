# CLAUDE.md

## Project description

This is the frontend app for https://runde.tips - the Haus23 Tipprunde. It is a SvelteKit application with the only purpose to read and display the rankings, tipps and results of this football results betting app.

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

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Architecture

**Stack:** SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + Drizzle ORM + Turso (libSQL/SQLite) + Vercel adapter

**Database layer** (`src/lib/server/db/`):

- `index.ts` — DB client (Turso via `drizzle-orm/libsql/web`), imports from `packages/db`, re-exports schema
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
- Only create DAL query functions when a concrete use case exists — no speculative helpers
- TypeScript 6.0 subpath imports (`#/`) resolve natively; no tsconfig paths needed
- If class attributes are getting to long (line-width way above 80 chars): group them semantically with the cn-helper int the `src/lib/utils.ts` file.

## Environment variables

Required in `.env` for local dev: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `APP_SECRET`, `RESEND_API_KEY`, `FROM_EMAIL`, `TOTP_EXPIRES_IN`, `TOTP_MAX_ATTEMPTS`, `SESSION_DURATION_DEFAULT`, `SESSION_DURATION_REMEMBER`

## UI Development

- Use bits-ui where appropriate
- Only use color tokens from the `src/routes/layout.css`. Or create new tokens if needed. The design system uses an orange/sand palette from RadixUI colors. That colors are listed in the comments.

## External Documentation (LLM-Ready)

- **bits-ui**
  - High-level Index: https://bits-ui.com/llms.txt
  - Full Doc: https://bits-ui.com/docs/llms.txt
  - _Usage Note:_ Fetch the full doc only when deep API details or complex code examples are required.
- **LayerChart** (Next Version, Svelte 5 ready)
  - High level Index: https://next.layerchart.com/llms.txt
  - Full Doc: https://next.layerchart.com/docs/llms.txt
  - _Usage Note:_ Fetch the full doc only when deep API details or complex code examples are required.
-

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
