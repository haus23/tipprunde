# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspace with two apps - `apps/web` (SvelteKit) and `apps/manager` (React Router 7 - and shared code library in the `packages/` directory. Currently only the `packages/db` library with the drizzle-orm schema definitions and relations.

### Frontend application (`apps/web`)

Related agent instructions:
@apps/web/CLAUDE.md

### Backend application (`apps/manager`)

Related agent instructions:
@apps/manager/CLAUDE.md

### DB package (`packages/db`)

In the `src` folder:

- `schema.ts` — Drizzle table definitions (SQLite). Core entities: `users`, `sessions`, `totpCodes`, `championships`, `rounds`, `matches`, `teams`, `leagues`, `tips`, `players`, `rulesets`
- `relations.ts` — Drizzle RQB v2 relations via `defineRelations`

This package uses the drizzle-orm@1.0 package. So all code querying this schemas should use the Drizzle RQB v2 query syntax: object shorthand in `where` with operators (`in`, `gt`, `isNotNull`, etc.) — do not use v1 callback form

## Release (from repo root):

```bash
# Patch version change: 0.1.2 -> 0.1.3  (It's a minor release arg due to major version 0)
bunx changelogen --noAuthors --release --minor --push
# Minor version change: 0.1.2 -> 0.2.0  (It's a major release arg due to major version 0)
bunx changelogen --noAuthors --release --major --push
```
