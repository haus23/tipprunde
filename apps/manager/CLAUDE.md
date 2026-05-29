# CLAUDE.md

## Project description

This is the backend app for https://runde.tips - the Haus23 Tipprunde. It is a React Router 7 Framework Mode application managing the data (championships, players, matches, teams, leagues, results, tips, ...) of this football results betting app.

## Commands

All commands run from `apps/manager` (or root with `pnpm --filter @tipprunde/manager`):

```bash
pnpm dev          # Start dev server (vite-plus)
pnpm build        # Build for production
pnpm typecheck    # Type-check files
```

Database commands:
There are currently no commands for managing the database. That happens in another project.
The SvelteKit app is just reading the db with drizzle-orm. No drizzle-kit setup.

## Docs

In the `docs/` folder you can find several hints for developing this app.

## External Documentation (LLM-Ready)

- **React Aria Components**
  - High-level Index: https://react-aria.adobe.com/llms.txt
