# Haus23 Tipprunde

The football prediction pool behind [runde.tips](https://runde.tips) — a small,
long-running game among friends: predict match results, collect points, argue
about the ruleset.

## Layout

pnpm workspace, one app and shared packages:

| Path              | What                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `apps/web`        | The whole site — public routes at `/`, management UI at `/manager` |
| `packages/db`     | Drizzle schema + relations (SQLite/Turso)                          |
| `packages/domain` | Scoring rules and tip point calculation                            |
| `packages/theme`  | Shared Tailwind v4 design tokens                                   |
| `packages/ui`     | Shared React components                                            |

**Stack:** React Router 8 (Framework Mode) · React Aria Components ·
Tailwind CSS 4 · Drizzle ORM · Turso (libSQL) · Cloudflare Workers

## Development

```bash
pnpm install
pnpm --filter web run dev
```

Needs `apps/web/.env` — see [docs/deployment.md](docs/deployment.md) for the
full variable list.

```bash
pnpm --filter web typecheck   # types
pnpm check                    # lint + format (vite-plus)
```

## Docs

Design and architecture notes live in [`docs/`](docs/); agent-facing
instructions in the `CLAUDE.md` files.
