# In-App Chat — Plan

**Status: planned, not started.**
This doc records the architecture decisions and reasoning from the 2026-07
discussion so the feature can start without re-deriving them.

> **The hosting premise below has already changed (2026-08-20).** It was written
> while the app ran on CF Workers with Railway as a future step. Railway is the
> host now, so wherever this doc phases something as "now (CF Workers)" versus
> "later (Railway)", the later column is simply the present — the CF-Workers
> phase never has to be built. What has _not_ changed is the storage decision:
> a separate database, not a second schema in the domain DB.
>
> **Decided 2026-08-20: skip the polling phase, go realtime directly.**
> Railway bills resources, not requests or connections
> ([pricing](https://docs.railway.com/reference/pricing): $10/GB-month memory,
> $20/vCPU-month, $0.05/GB egress), so at a handful of users neither option
> registers against the $5 credit. Cost is simply not the deciding factor here;
> polling's real cost is querying the database around the clock for nothing.
>
> **And the transport is WebSockets, not SSE** — reversing the preference
> stated below, which assumed SSE was the lower-effort path. On Railway it is
> not ([SSE vs WebSockets](https://docs.railway.com/guides/sse-vs-websockets)):
> SSE rides on a normal HTTP response and inherits the request limits — closed
> after **5 minutes without data**, capped at **15 minutes** even with
> heartbeats — so it would need heartbeat comment lines _and_ reconnect-on-cap
> handling. **WebSockets are exempt from those timeouts and may stay open
> indefinitely, idle included.** The one argument for SSE was avoiding custom
> server glue, and that server (`server/app.ts`) already exists from the
> Railway move. The client still needs reconnect logic either way, because
> deploys drop connections.
>
> Unchanged either way: **Railway app sleeping must stay off.**

Chat lands in the single RR8 app (`apps/web`) — the merge that made it single
is done ([04-app-merge.md](./04-app-merge.md)). The shell/layout side (docked rail vs.
drawer, keep-mounted constraint) is specced in
[web-shell.md](../web-shell.md); this doc covers storage, transport, and the
message UI.

## Requirements & constraints

- **In-app.** A link-out to Discord/Telegram was considered and explicitly
  rejected — chat must live inside the app.
- **Message archive must not live in the main domain DB.** Satisfied via
  separation (a second database), not externalization.
- **No paid service.** Chat-SaaS SDKs (Stream, Sendbird) have free tiers but were
  rejected: real integration work (auth bridging, vendor SDK/UI) plus an external
  dependency, for a feature whose scale doesn't need them.
- **Audience is ~10–20 logged-in players.** This forgives nearly every hard
  problem real chat products have (fan-out, presence at scale, message search).
  Simple choices are correct choices here.
- **Auth is already solved.** Reuse the `__auth` session; chat is for logged-in
  users. No anonymous mode.

## Architecture: three independent layers

Storage, transport, and UI are deliberately decoupled so each can evolve without
touching the others — in particular, the transport upgrades with the hosting
migration (CF Workers → Railway) while storage and UI stay untouched.

## Storage

A **separate database** from the domain DB, phased with hosting:

- **Now (CF Workers dev):** a second Turso database. Works unchanged with the
  existing `drizzle-orm/libsql/web` setup; chat gets its own connection with its
  own env vars (`CHAT_DATABASE_URL` / `CHAT_AUTH_TOKEN` or similar).
- **Later (Railway):** a second SQLite instance — sqld, or a plain file with
  Litestream backup (the earlier self-hosting backup thinking transfers
  directly). Same drizzle schema, different connection string.

Schema sketch (single table is enough to start):

```
chatMessages
  id         integer pk autoincrement
  userId     integer         -- references users.id *by value*; no FK across DBs
  body       text
  createdAt  text (ISO)
  deletedAt  text | null     -- soft delete, if moderation is ever needed
```

Notes:

- **No cross-DB foreign key** — `userId` is a plain value; user names resolve at
  render time from the session/domain data already loaded in the app.
- **Cursor pagination by `id`** (autoincrement doubles as the cursor) for the
  history query; newest page first, older pages prepended.
- The chat schema does **not** go into `packages/db` (domain). It lives
  app-local in `apps/web` — with one app there is no second consumer that would
  justify a package.

## Transport (the phased part)

The constraint is the **host**, not the framework: Cloudflare Workers has no
plain long-lived WebSocket without Durable Objects. That shapes the phases:

| Option                      | Works on CF Workers (today)                                        | Works on Railway                                           | Effort |
| --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- | ------ |
| Polling (`refetchInterval`) | ✅                                                                 | ✅                                                         | none   |
| SSE stream                  | ⚠️ stream works, but fan-out needs DO or DB-poll inside the stream | ✅ easy                                                    | low    |
| WebSockets                  | ❌ needs Durable Objects                                           | ✅ `ws` attached via custom Node entry (~30 lines of glue) | medium |

- **v1 — polling.** A 3–5s poll on the messages query; sending is a plain action
  that inserts and lets RR revalidate. At this user count polling is
  indistinguishable from realtime, needs zero new infrastructure, and ships on
  the current CF hosting. This is the one place the merge left the door open for
  TanStack Query to re-enter surgically (`refetchInterval`) — see the data
  strategy decision in [04-app-merge.md](./04-app-merge.md); a bare `setInterval` +
  `fetcher.load()` may well be enough.
- **v2 — after Railway.** Swap polling for SSE (preferred: chat clients mostly
  _receive_; no custom server glue, proxy-friendly) or WebSockets (needs a
  custom Node entry beside RR8's request handler). This is a transport-layer
  change only.
- **Contingency if Railway slips:** Durable Objects with WebSocket hibernation +
  built-in DO SQLite storage is Cloudflare's canonical chat pattern and would
  provide "WebSockets + a second SQLite" on current hosting (the app's custom
  `workers/app.ts` shows the pattern for exporting extra classes beside the
  app). Rejected as the default because it is CF-proprietary and prod is heading
  to Railway — only revisit if that changes.

### Consequence (noted 2026-09-08): the dev server has to move too

WebSockets need the raw `http.Server` to handle `upgrade`. In production
`server/app.ts` already owns it. **In development nothing does** — `pnpm dev`
runs `react-router dev`, which brings its own Vite server, and `server/app.ts`
is never loaded. A chat cannot be developed locally with a socket that only
exists in production, so the custom server has to serve dev as well before this
work can start.

That is the documented path
([Running a Custom Server in Development](https://reactrouter.com/api/other-api/adapter#migrating-from-the-react-router-app-server)),
and it is a restructure, not a flag:

- `server/app.ts` stops importing the build by path (`../dist/server/index.js`,
  which does not exist in dev) and imports `virtual:react-router/server-build`
  instead. That makes it part of the Vite SSR build — an input in
  `vite.config.ts` — rather than a file Node reads directly with type stripping.
- A thin outer `server.js`, plain JS and outside the build, boots Vite in
  middleware mode for dev and the built server for production. `--conditions
development` goes in the dev script.
- In dev the build must be loaded **per request**, or HMR never takes effect.
  `createRequestHandler` accepts a function for exactly this and re-derives on
  each call, so the `handleError` injection (see
  [07-observability.md](./07-observability.md)) moves inside that function
  unchanged.

**No Express.** The doc's example uses it, but Vite's middleware is
Connect-style `(req, res, next)` — the same shape as the `compression` and
`sirv` handlers `server/app.ts` already chains by hand.

Two things this fixes in passing, both from the observability work:

- `handleError` and `trustProxy` would finally run in development. (Not that
  `trustProxy` becomes testable — nothing sends `X-Forwarded-*` locally either
  way.)
- The report should regain the **user**. It cannot carry one today because
  `app/lib/context.ts` exists twice — once inside the SSR bundle, once in the
  raw-Node `server/app.ts` — so `context.get(userContext)` never matches. One
  Rollup graph means one instance. Expected, not yet measured.

## Message list UI

TanStack Virtual shipped first-class chat support
([blog post](https://tanstack.com/blog/tanstack-virtual-chat)) — it covers
exactly the previously-fiddly rendering layer, and _only_ that (explicitly
headless; no transport/storage opinions):

- `anchorTo: 'end'` — end-anchored virtualization; the bottom is the stable
  visual point, so prepending older history pages doesn't shift the viewport.
- `followOnAppend` — stay pinned to newest messages _only_ when already at the
  bottom; reading history is never interrupted by incoming messages.
- **Stable keys via `getItemKey` with message ids** — index keys break
  prepending. The autoincrement `id` serves.

Shell integration per [web-shell.md](../web-shell.md): docked ~340px rail ≥ `lg`,
drawer overlay below; the chat component stays **always mounted** (draft text,
scroll position, and — in v2 — the live connection survive dock/undock).

## Phasing summary

1. **v1 (can ship on CF, before Railway):** second Turso DB + drizzle schema,
   loader for cursor-paginated history and an action for send, polling,
   TanStack Virtual end-anchored list, shell integration per web-shell.md.
2. **v2 (after Railway):** transport swap to SSE/WS. Nothing else changes.

## Open questions

- **Room model:** one global room, or per-championship rooms? (Start global —
  it's one friend group; the schema gains a `roomId`/`championshipId` column
  only if ever needed.)
- **Retention/moderation:** keep forever? Manager-role soft delete via
  `deletedAt`?
- **Unread indicator** on the drawer toggle (badge) — v1 nicety or later?
- **Notifications** (push/mail) — explicitly out of scope for v1/v2.
