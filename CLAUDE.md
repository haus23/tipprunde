# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspace with two apps and shared packages:

- `apps/web` — New web frontend (TanStack Start) — **work in progress**
- `apps/manager` — Backend management app (React Router 7)
- `apps/web-legacy` — Original SvelteKit frontend, kept as reference only — do not modify
- `packages/db` — Drizzle ORM schema + relations (SQLite/Turso)
- `packages/domain` — Domain logic: scoring rules, tip point calculation
- `packages/theme` — Shared Tailwind CSS v4 design tokens (Radix Sand + Orange palette)
- `packages/ui` — Shared React components reused across both apps

### Frontend application (`apps/web`)

Related agent instructions:
@apps/web/CLAUDE.md

### Backend application (`apps/manager`)

Related agent instructions:
@apps/manager/CLAUDE.md

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

## Docs

Shared documentation in `docs/`:

- `domain.md` — Domain model: championship/round feature flags, ruleset rule IDs, scoring chain, open design questions
- `theme.md` — Color system: Radix Sand/Orange tokens, `@tipprunde/theme` package usage
- `tokens.md` — Design tokens: border-radius scale
- `deployment.md` — Environment variables, first-deploy bootstrap, user management

## Release (from repo root):

```bash
# Patch version change: 0.1.2 -> 0.1.3  (It's a minor release arg due to major version 0)
pnpx changelogen --noAuthors --release --minor --push
# Minor version change: 0.1.2 -> 0.2.0  (It's a major release arg due to major version 0)
pnpx changelogen --noAuthors --release --major --push
```
