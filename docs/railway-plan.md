# Production Hosting — Railway Plan

**Status: step 2 done and live; step 3 deferred indefinitely (2026-08-20).**
Replaces the earlier self-hosted Hetzner idea. Three-step sequence: **app merge
([app-merge.md](./app-merge.md)) → Railway → Turso→Litestream switch**. Each
step ships independently:

**Step 3 is no longer treated as required.** Running on Railway against Turso
performs very well, so the move to a local SQLite file plus Litestream buys
little today. The one thing that would force it is **outgrowing Turso's free
tier**. Everything below about step 3 stays as a worked-out plan for that case,
not as pending work.

**Railway project (2026-08-13):** `tipprunde` service at
`https://tipprunde.up.railway.app`. It now runs against this rebuild's own
"prod" Turso database — switched over deliberately, with a backup taken first,
once the service had proven itself; the caution below about staying on the dev
branch describes the initial state, not the current one. Verified end-to-end against the live URL:
SSR render, 404 handling, the `/manager` → `/login` middleware redirect,
and immutable-cached gzip assets — same checks as the local build, all
correct. Root Directory is the repo root (not `apps/web` — required for
pnpm workspace resolution), Build Command `pnpm --filter web build`, Start
Command `pnpm --filter web start`. Railway auto-injects its own `PORT`;
`server/app.ts` already trusts whatever it's given, so nothing to configure
there — a manually-set `PORT` variable in the dashboard is dead weight, not
a bug, if you see the container listening on a different port than you
expected.

1. ~~**App merge** — no infra change, ships on current CF hosting.~~
   **Done 2026-08-09**, live on the single `tipprunde` Worker, serving only
   `next.runde.tips` (see below — this did **not** touch real prod).
2. ~~**Railway move**~~ — **done.** No data-layer change: the merged app runs
   on Railway **still against Turso** (`drizzle-orm/libsql/web` works from
   anywhere). The DNS cutover (problem 9) is a separate matter — it is the
   rebuild's go-live, not part of the hosting move.
3. **Turso → local SQLite + Litestream** — **deferred**, see above. Pure
   DB-layer change on stable hosting: volume, driver swap, Litestream,
   migration-workflow change.

## What this plan actually cuts over — read this before "DNS cutover" below

This app (the RR8/Turso rebuild in this repo) is **not** live production
today. Real prod is a separate, older stack that's held real data since
2022 and is unrelated to this repo:

- `hinterhof.runde.tips` — CF Worker, React Router SPA, direct Firestore
  realtime bindings.
- `unterbau.runde.tips` — Nitro JS server, caches Firestore reads to avoid
  its billing.
- `runde.tips` (the real apex domain) — CF Worker, **TanStack Router** SPA,
  reads from `unterbau`.

This repo's Worker (`tipprunde`) only serves **`next.runde.tips`** today —
it has never had the apex domain. **Step 9's "DNS cutover" below is not a
routine infra swap: it's the go-live moment for the whole rebuild**,
retiring all three services above at once, once this app holds the full
2002–now history (including the currently-running Hinrunde 2026/27, entered
into _real_ prod today and imported here later, not double-entered by
hand). Full detail: `[[project_system_landscape]]` in memory.

Current CF Workers hosting (see [deployment.md](./deployment.md)) stays for
dev/`next.runde.tips` and runs in parallel during the transition. The chat
feature's transport upgrade ([chat-plan.md](./chat-plan.md) v2) depends on
this move.

## Keeping CF (`next.runde.tips`) alive during the transition

> **This already played out as written.** The CF build path was removed with
> the Node build target, so `main` cannot produce a Worker any more and
> `next.runde.tips` has been frozen on its last pre-merge deployment ever
> since. It still answers, with stale code — do not read it as a check of
> anything current. The section is kept as the record of how that came about.

CF's Git integration (Workers Builds) auto-builds and deploys on every push
to the **production branch** (`main`) — there is no manual `wrangler deploy`
step to reason about. This only concerns `next.runde.tips`: the real apex
`runde.tips` is not on the `tipprunde` Worker and is untouched by anything
in this section.

This makes branch isolation the load-bearing safety mechanism for problem 1
below, not a nice-to-have: do the `@cloudflare/vite-plugin` → Node build-
target swap on a branch, not `main`. Non-production-branch pushes only
produce CF **preview** builds (their own preview URL, not bound to
`next.runde.tips`), so the branch can fail to build on CF for as long as
needed without touching what's live there. Only merge to `main` at the
actual cutover.

From that merge onward, every `main` push gives CF a build it structurally
can't produce (no Workers output to deploy) — but a failed build is never
promoted, so `next.runde.tips` keeps serving the last successful deployment
automatically, frozen, no action required. Disconnecting the Git integration
at that point is optional cleanup (stops CF flagging every later, unrelated
push as a failed build) — do it then, not before.

**`next.runde.tips` retirement (decided 2026-08-12):** stays alive as a
fallback through **both** step 2 and step 3. Moving the real `runde.tips`
DNS to Railway (step 9) is unrelated to this Worker, so `next.runde.tips`
keeps working unmodified as a rollback reference the whole time. Delete the
domain only once step 3 (local SQLite + Litestream) is proven — holding it
beyond that point stops making sense once the DB layer is settled too.

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
**the standard RR8 Node build of the single merged app**. No dispatcher, no
path-splitting, no multi-root static serving.

**Custom server, not `@react-router/serve` (decided 2026-08-12).**
`@react-router/serve` is a thin CLI wrapper around exactly two things: static
file serving over `dist/client`, and the built request handler — both of
which a ~20-line custom Node server covers directly (RR8's own docs show the
equivalent: `http.createServer`, `sirv` for static with compression +
immutable cache headers on hashed assets, `createRequestHandler` for
everything else). Building it now, as part of step 2, rather than starting
with `@react-router/serve` and swapping later: chat v2 already needs raw
access to the HTTP server for SSE/WS, so this avoids doing the same "swap the
server" migration twice. It also directly resolves problem 2 below — static
serving is most of what the custom server exists to do.

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
2. **Static assets.** CF's assets binding served files implicitly; the
   custom Node server (see Architecture above) serves `dist/client` via
   `sirv`, with compression and immutable cache headers on hashed assets.
3. **DB driver switch (step 3 only).** `drizzle-orm/libsql/web` (fetch-only) →
   file-capable client (`drizzle-orm/libsql` with `file:` URL). Env-driven,
   few lines. Enable WAL + busy_timeout on boot.
4. **Migrations workflow changes (step 3 only).** `drizzle-kit migrate` can't
   reach a file inside a Railway volume from a laptop. Run migrations on boot
   (entrypoint step before Litestream `-exec`) or via `railway ssh`. Replaces
   the current remote `db:migrate:prod` habit.
5. **Data cutover is trivial by design.** This rebuild's own Turso DB (not
   real prod — see above; this is where the 50-championships backlog is
   being entered by hand, with the current season imported once the gap
   closes rather than re-typed) is a portable file: dump it → local SQLite
   file → seed the volume (or restore via Litestream). No live migration
   needed.
6. **Restore test is mandatory.** An untested backup is not a backup: once
   running, delete the volume on a throwaway service and prove the
   `-if-db-not-exists` restore brings everything back.
7. **Litestream write-ops budget.** R2 free tier = 1M Class A ops/month;
   Litestream PUTs only on actual writes. Sporadic write pattern → far under.
   If ever concerned, raise `sync-interval` (1s → 10s).
8. **Do not enable Railway app sleeping.** Not needed (budget fits), breaks
   chat v2's SSE/WS, and adds cold starts.
9. **DNS cutover — the rebuild's actual go-live.** Real prod's `runde.tips`
   is on a Custom Domain/Route pointing at the legacy stack today (see "What
   this plan actually cuts over" above), not at anything of ours — moving it
   to Railway (CNAME, proxied or DNS-only) is a first-time assignment for
   this app, not a swap away from `tipprunde`. `next.runde.tips` (CF
   Workers) is a separate hostname, untouched, and can stay up in parallel —
   no big-bang switch for it. **`hinterhof.runde.tips` and
   `unterbau.runde.tips` are retired outright at this point (decided
   2026-08-12)** — this app's `/manager` supersedes hinterhof's admin
   function, and no Firestore left to shield means unterbau has nothing left
   to do.

## What stays on Cloudflare

DNS (free plan), R2 (backup target), and — as a fallback until step 3 is
proven, see "Keeping CF alive during the transition" above — `next.runde.tips`
on the `tipprunde` Worker. Turso remains for the dev DB only, on the free
tier, and can retire once dev also runs against local files if ever desired.

## Open questions

Two left, both **deliberately deferred** (decided 2026-08-12) rather than
overlooked — both benefit from a real Railway service to test against, which
doesn't exist yet (see prerequisite at the top), and neither blocks any work
before its own step:

- Migrate-on-boot vs `railway ssh` for schema migrations — step 3 only.
- Proxied (orange cloud) vs DNS-only for the Railway CNAME — step 9 only.
  **Note recorded 2026-08-20, decision still open:** CF stays in the path for
  `runde.tips` regardless (it already owns the DNS), so if proxied is chosen,
  CF's default edge cache already respects `Cache-Control` — which
  `server/app.ts`'s `sirv` already sets to `public, max-age=31536000,
immutable` on every hashed asset. Railway also has its own CDN (opt-in per
  service; was fully disabled for a few months after a March 2026 incident,
  back since ~July 2026 — see
  [docs.railway.com/networking/cdn](https://docs.railway.com/networking/cdn)).
  Running both would just stack two cache layers with no real upside beyond
  one, plus a staleness-debugging surface neither alone has. If proxied wins,
  the likely call is CF's cache only, Railway's CDN left off.

Still genuinely open:

- When to cut `runde.tips` DNS over to Railway: after the 50-championships
  backlog entry, together with chat v1 → v2, or earlier as a standalone
  infra change. (`next.runde.tips`'s own retirement, and the fate of
  `hinterhof`/`unterbau`, are both decided — see above; this is only about
  the timing of the production hostname move.)
