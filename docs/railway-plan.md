# Production Hosting — Railway Plan

**Status: decided direction, not started (2026-07-30).** Replaces the earlier
self-hosted Hetzner idea. Step 2 of the three-step sequence: **app merge
([app-merge.md](./app-merge.md)) → Railway → Turso→Litestream switch**. Each
step ships independently:

1. **App merge** — no infra change, ships on current CF hosting.
2. **Railway move** — no data-layer change: the merged app runs on Railway
   **still against Turso** (`drizzle-orm/libsql/web` works from anywhere).
3. **Turso → local SQLite + Litestream** — pure DB-layer change on stable
   hosting: volume, driver swap, Litestream, migration-workflow change.

Current CF Workers hosting (see [deployment.md](./deployment.md)) stays for
dev/`next.runde.tips` and runs in parallel during the transition. The chat
feature's transport upgrade ([chat-plan.md](./chat-plan.md) v2) depends on
this move.

## Cost target & breakdown

Goal: **flat $5/month** — the Railway Hobby subscription, with usage staying
inside its included $5 credit.

| Item                                                | Rate                                  | Estimate    |
| --------------------------------------------------- | ------------------------------------- | ----------- |
| Railway Hobby subscription                          | $5/mo incl. $5 usage credit           | $5.00 flat  |
| 1 Node service, single merged app (~200–300 MB RAM) | $10/GB-month                          | ~$2.00–3.00 |
| CPU (bursty, idle-near-zero)                        | $20/vCPU-month                        | ~$0.25      |
| Volume for SQLite (1 GB)                            | $0.15/GB-month                        | ~$0.15      |
| Egress                                              | $0.05/GB                              | ~$0.10      |
| Litestream                                          | Apache-2.0 OSS                        | $0          |
| Backup storage: Cloudflare R2 free tier             | 10 GB, 1M Class A ops/mo, zero egress | $0          |
| DNS (Cloudflare free), domain, mail service         | existing                              | unchanged   |

Usage lands ~$3–4 → inside the credit. The **two-services variant (+ Caddy
proxy) was rejected on cost**: two always-on Node processes ≈ $4 RAM alone,
plus proxy — at or past the credit, and Railway has no path-based routing
between services anyway.

## Architecture: one Node service, one app

Originally planned as a two-fetch-handler dispatcher; the app merge
([app-merge.md](./app-merge.md)) simplifies this to the boring default —
**the standard RR8 Node build of the single merged app** (possibly literally
`@react-router/serve`, else a tiny fetch-handler adapter). No dispatcher, no
path-splitting, no multi-root static serving.

- SQLite file on a Railway volume (`/data`), **WAL mode + busy_timeout**.
  One process, one file — **sqld is dropped** from the plan (its whole
  justification was two separate processes on one file).
- Litestream runs as the container entrypoint via `-exec` (it supervises the
  Node process), replicating to R2 (S3-compatible endpoint). On boot:
  `litestream restore -if-db-not-exists` → a lost volume self-heals from R2.
- Single Dockerfile: node + litestream binary. Region: EU (Amsterdam).

## Problems to tackle (the honest list)

1. **Node build target.** Swap `@cloudflare/vite-plugin` out of the merged
   app's build for RR8's standard Node build. Cleanest as a full cutover, not
   a dual-target build.
2. **Static assets.** CF's assets binding served files implicitly; the Node
   server needs static serving over `dist/client` (`@react-router/serve`
   brings this built-in; otherwise sirv).
3. **DB driver switch (step 3 only).** `drizzle-orm/libsql/web` (fetch-only) →
   file-capable client (`drizzle-orm/libsql` with `file:` URL). Env-driven,
   few lines. Enable WAL + busy_timeout on boot.
4. **Migrations workflow changes (step 3 only).** `drizzle-kit migrate` can't
   reach a file inside a Railway volume from a laptop. Run migrations on boot
   (entrypoint step before Litestream `-exec`) or via `railway ssh`. Replaces
   the current remote `db:migrate:prod` habit.
5. **Data cutover is trivial by design.** The prod DB is a portable file:
   dump the dev Turso DB (where the 50-championships backlog is being
   entered) → local SQLite file → seed the volume (or restore via
   Litestream). No live migration needed.
6. **Restore test is mandatory.** An untested backup is not a backup: once
   running, delete the volume on a throwaway service and prove the
   `-if-db-not-exists` restore brings everything back.
7. **Litestream write-ops budget.** R2 free tier = 1M Class A ops/month;
   Litestream PUTs only on actual writes. Sporadic write pattern → far under.
   If ever concerned, raise `sync-interval` (1s → 10s).
8. **Do not enable Railway app sleeping.** Not needed (budget fits), breaks
   chat v2's SSE/WS, and adds cold starts.
9. **DNS cutover.** `runde.tips` via CF DNS (CNAME to Railway, proxied or
   DNS-only). `next.runde.tips` (CF Workers) can stay up in parallel —
   no big-bang switch.

## What stays on Cloudflare

DNS (free plan), R2 (backup target), and — during transition — the existing
dev deployment at `next.runde.tips`. Turso remains for the dev DB only, on
the free tier, and can retire once dev also runs against local files if ever
desired.

## Open questions

- `@react-router/serve` as-is vs. a small custom server (the latter becomes
  necessary at chat v2 anyway, for SSE/WS beside the request handler).
- Migrate-on-boot vs `railway ssh` for schema migrations.
- Proxied (orange cloud) vs DNS-only for the Railway CNAME.
- When to cut over: after the 50-championships backlog entry, together with
  chat v1 → v2, or earlier as a standalone infra change.
