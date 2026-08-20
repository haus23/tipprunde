# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspace with one app and shared packages:

- `apps/web` — The whole site: public routes at the root, management UI under
  `/manager` (React Router 8)
- `packages/db` — Drizzle ORM schema + relations (SQLite/Turso)
- `packages/domain` — Domain logic: scoring rules, tip point calculation
- `packages/theme` — Shared Tailwind CSS v4 design tokens (Radix Sand + Orange palette)
- `packages/ui` — Generic UI primitives. The package boundary is the point: nothing in here can import app code, the router or domain types

### Application (`apps/web`)

Related agent instructions:
@apps/web/CLAUDE.md

### DB package (`packages/db`)

In the `src` folder:

- `schema.ts` — Drizzle table definitions (SQLite). Core entities: `users`, `sessions`, `totpCodes`, `championships`, `rounds`, `matches`, `teams`, `leagues`, `tips`, `players`, `rulesets`, `extraQuestions`, `extraAnswers`
- `relations.ts` — Drizzle RQB v2 relations via `defineRelations`

This package uses the drizzle-orm@1.0 package. So all code querying these schemas should use the Drizzle RQB v2 query syntax: object shorthand in `where` with operators (`in`, `gt`, `isNotNull`, etc.) — do not use v1 callback form

### Domain package (`packages/domain`)

- `rules.ts` — Rule ID constants (tip rules, joker rules, match rules, round rules, extra question rules)
- `scoring.ts` — `calcTipPoints(tip, result, tipRuleId, isDoubleRound, joker)` — returns `number | null` (null = no result yet, 0 = wrong tip)

Test: `node --experimental-strip-types --test src/scoring.test.ts`

### Theme package (`packages/theme`)

Single export: `@tipprunde/theme` → `src/theme.css`

Consumed in apps via `@import "@tipprunde/theme"` in the app's main CSS file. Contains the full `@theme inline {}` block, `@custom-variant dark`, and `@layer base` styles. Do not add app-specific tokens here.

## Commands (from repo root)

Use pnpm workspace filters instead of `cd`-ing into a package — `--filter web`
matches by directory name:

```bash
pnpm --filter web run dev          # dev server (apps/web)
pnpm --filter web typecheck        # type-check the app
```

The same pattern works for any package script (`build`, `typecheck`, etc.).

## Docs

Shared documentation in `docs/`:

**Reference — kept current as the code changes:**

- `domain.md` — Domain model: championship/round feature flags, ruleset rule IDs, scoring chain
- `theme.md` — Color system: Radix Sand/Orange tokens, `@tipprunde/theme` package usage
- `tokens.md` — Design tokens: breakpoints, easing, shadows, border-radius, typography scale
- `deployment.md` — Railway service + environments, environment variables, first-deploy bootstrap
- `web-shell.md` — Public shell: header contents, nav strategy, planned docked/drawer chat panel
- `archiv.md` — Archiv feature: ranking columns on `players`, dashboard entry

**Decisions (`docs/decisions/`) — dated records of why something is the way it
is. Superseded, never quietly rewritten:**

- `01-chat.md` — In-app chat: separate DB, WebSocket transport, TanStack Virtual (not built)
- `02-hosting-railway.md` — Single Node service on Railway (live); SQLite+Litestream deferred unless Turso's free tier runs out
- `03-color-scheme.md` — Single-button light/dark switch: stored vs. resolved state, click algorithm
- `04-app-merge.md` — How the TanStack Start app merged into the RR8 app (done 2026-08-09)
- `05-championship-scope.md` — Championship as a URL dimension; Archiv and current season share route files
- `06-verlauf-bump-chart.md` — Punkteverlauf as a bump chart, and the measurement that picked that form

## Skills

AGENTS.md has instructions to find skills beside the autodiscoverable skills in your .claude folder

After adding or changing interactive UI elements (buttons, popovers, accordions, hover states, animations), run the `emil-design-eng` skill to review animation and transition quality.

## Release (from repo root):

```bash
# Fix:      1.0.0 -> 1.0.1
pnpx changelogen --noAuthors --release --patch --push
# Feature:  1.0.0 -> 1.1.0
pnpx changelogen --noAuthors --release --minor --push
# Breaking: 1.0.0 -> 2.0.0
pnpx changelogen --noAuthors --release --major --push
```

Release **after** the PR's check is green but **before** merging, on the PR
branch — the release commit rides along and production deploys once instead of
twice. Merge with `--merge`, never `--rebase`: a rebase rewrites the commits,
which would leave the tag pointing at a commit `main` never took.

For a one-off jump to an exact version, `-r` sets it explicitly:

```bash
pnpx changelogen --noAuthors --release -r 1.0.0 --push
```

**What counts as breaking here.** There is no public API, so it comes down to
three things: public URLs (links are shared and bookmarked — see
`01-chat.md`), the DB schema, and the session/cookie format. Changing any of
those is a major.
