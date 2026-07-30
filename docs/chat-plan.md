# In-App Chat — Plan

**Status: planned, not started.** Picks up after the pending rule changes land.
This doc records the architecture decisions and reasoning from the 2026-07 discussion
so the feature can start without re-deriving them.

**Update 2026-07-30:** chat lands in the **merged RR8 app**
([app-merge.md](./app-merge.md)) — TanStack-Start-specific mentions below
(server functions) translate to RR8 loaders/actions; TanStack Query (for the
v1 polling) and TanStack Virtual work in RR8 unchanged. The "where does the
chat schema live" open question resolves to: app-local in the single app. The shell/layout side (docked
rail vs. drawer, keep-mounted constraint) is already specced in
[web-shell.md](./web-shell.md) — this doc covers storage, transport, and the
message UI.

## Requirements & constraints

- **In-app.** A link-out to Discord/Telegram was considered and explicitly
  rejected — chat must live inside the web app.
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
- The chat schema should **not** go into `packages/db`(domain). App-local schema
  in `apps/web`, or a tiny separate package — open question below.

## Transport (the phased part)

TanStack Start has **no first-class WebSocket abstraction** — that constraint
shapes the phases:

| Option                      | Works on CF Workers (today)                                        | Works on Railway                                           | Effort |
| --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- | ------ |
| Polling (`refetchInterval`) | ✅                                                                 | ✅                                                         | none   |
| SSE stream                  | ⚠️ stream works, but fan-out needs DO or DB-poll inside the stream | ✅ easy                                                    | low    |
| WebSockets                  | ❌ needs Durable Objects                                           | ✅ `ws` attached via custom Node entry (~30 lines of glue) | medium |

- **v1 — polling.** TanStack Query with `refetchInterval` of 3–5s on the
  messages query; sending is a plain server function that inserts + invalidates.
  At this user count polling is indistinguishable from realtime, needs zero new
  infrastructure, and ships on the current CF hosting.
- **v2 — after Railway.** Swap polling for SSE (preferred: chat clients mostly
  _receive_; no custom server glue, proxy-friendly) or WebSockets (needs the
  custom Node entry beside Start's request handler). This is a transport-layer
  change only.
- **Contingency if Railway slips:** Durable Objects with WebSocket hibernation +
  built-in DO SQLite storage is Cloudflare's canonical chat pattern and would
  provide "WebSockets + a second SQLite" on current hosting (the manager app's
  custom `workers/app.ts` shows the pattern for exporting extra classes beside
  the app). Rejected as the default because it is CF-proprietary and prod is
  heading to Railway — only revisit if that changes.

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

Shell integration per [web-shell.md](./web-shell.md): docked ~340px rail ≥ `lg`,
drawer overlay below; the chat component stays **always mounted** (draft text,
scroll position, and — in v2 — the live connection survive dock/undock).

## Phasing summary

1. **v1 (can ship on CF, before Railway):** second Turso DB + drizzle schema,
   server functions for send + cursor-paginated history, TanStack Query polling,
   TanStack Virtual end-anchored list, shell integration per web-shell.md.
2. **v2 (after Railway):** transport swap to SSE/WS. Nothing else changes.

## Open questions

- **Room model:** one global room, or per-championship rooms? (Start global —
  it's one friend group; the schema gains a `roomId`/`championshipId` column
  only if ever needed.)
- **Where does the chat drizzle schema live** — `apps/web`-local or a separate
  package? (Manager app probably never needs it; app-local is the simplest.)
- **Retention/moderation:** keep forever? Manager-role soft delete via
  `deletedAt`?
- **Unread indicator** on the drawer toggle (badge) — v1 nicety or later?
- **Notifications** (push/mail) — explicitly out of scope for v1/v2.
