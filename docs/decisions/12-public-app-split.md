# Public App Split — a Separate, Framework-Free Public Site

**Status: future idea (written 2026-09-29, kept as a record).** Not
decided, not planned, not started — and nothing in the roadmap depends on
it. A thought experiment about a different architecture, written down so it
can be picked up later, or dropped. It is deliberately **separate from the
existing app**: nothing here changes how `apps/web` works today, and how it
would relate to the current web-shell plan or
[11-turnier-routing-homepage.md](./11-turnier-routing-homepage.md) is left
open on purpose.

**Since then (2026-10-08):** the public site got its poster theme
([13-public-poster-theme.md](./13-public-poster-theme.md)) inside the React
app. Its tokens are plain CSS variables and Anton is a self-hosted font, so a
framework-free public site could carry the look over — but it would have to
reimplement the light/dark switch and the `data-theme` scoping.

## Why think about it at all

Not load — the site serves a small group, and every performance score rates
the current app at 100. The motive is craft: a public site that is as lean as
its content allows.

A proof of concept ([haus23/tipprunde-www-claude](https://github.com/haus23/tipprunde-www-claude),
reading the legacy JSON API) rendered the table page with **0.01 MB in 4
requests**; the current app needs **0.28 MB in 30 requests**. Navigation and
progressive enhancement fit in **3.7 kB** of JavaScript. The difference is
framework overhead: React, the router runtime, React Aria, per-route chunks,
and hydration of pages that are almost entirely read-only.

## Two kinds of software, two apps

- **Public site** — reading: tables, matches, tips, Verlauf, Archiv,
  Nachspielzeit. Documents with a little interaction.
- **App** (e.g. `app.runde.tips`) — writing: today's manager, the login, and
  later players editing their own tips as a role-based area. A real
  application, where React and React Aria earn their keep.

A shared framework forces the same compromise on both. Split, each can be
built the way its job suggests.

## The public site

- Server-rendered, multi-page, no framework — tagged-template HTML, as in
  the proof of concept. Where it runs is open: a **Cloudflare Worker** (the
  sections below, up to Chat) or **the existing Node server, next to the
  app** (see "Alternative: one Node server, two apps").
- **Native HTML for interaction** (`<select>`, `<details>`, links) instead of
  widget libraries: keyboard, touch and screen readers work without custom
  logic, at the cost of browser-styled dropdowns.
- **Progressive enhancement** only: auto-submitting pickers, menu closing,
  background refresh, speculation-rules prefetch, offline fallback.
- **No database access at all.** It reads published data (below) and a signed
  cookie, nothing else.

## Data: published JSON, not live queries

Of the four options considered, publishing wins:

|       | Idea                                                                              | Verdict                                                                        |
| ----- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A     | Public site on Railway, rendering from the DB per request                         | Works, but just today's app split in two                                       |
| B     | Worker at the edge, live DB queries                                               | Edge rendering waits on a DB in one region — often slower than A               |
| C     | Like B, plus an edge cache purged by the app on every write                       | Good middle ground; the PoC is effectively this, with the legacy API as origin |
| **D** | **The app publishes one JSON per championship to R2; the Worker renders from it** | **Chosen shape**                                                               |

Why D fits this domain:

- **59 of 60 championships never change again.** They are published once and
  stay. After a write, the app republishes only the running championship
  plus the cross-championship data (Archiv list, Ewige Tabelle).
- **Small:** roughly 100–300 KB of JSON per championship, 10–20 MB for the
  whole history — a fraction of R2's free tier.
- **Data, not pages:** no pre-rendering thousands of HTML files; the Worker
  renders a page from its championship's JSON on request, in milliseconds.
- **R2, not KV:** R2 serves a new object immediately; KV can take up to about
  a minute to propagate, and caps free writes per day.

## Authentication: login by redirect, one shared cookie

- **Login and logout live in the app.** "Anmelden" on the public site links
  to the app's login with a return path; the app runs the existing TOTP flow,
  sets the cookie, and redirects back. The public site calls no auth API for
  this.
- **The cookie is set for `Domain=runde.tips`**, so the browser sends it to
  the public site and every subdomain alike. `SameSite=Lax` still works — the
  subdomains count as the same site.
- **It carries the session id and the user slug, signed (HMAC).** The public
  site verifies the signature and uses the slug for _cosmetic_
  personalization only — highlighting the player's own row, defaulting to
  their own tips — rendered server-side, no extra request.
- **Anything authorization-relevant stays in the app** and checks the session
  in the DB, as today. The role is deliberately **not** in the cookie, so a
  role change takes effect at once. A revoked session may keep its cosmetic
  highlighting until the cookie expires — harmless.

## Database: owned by the app alone

Only the app touches the database. That keeps the options open if Turso is
ever left behind:

- **SQLite + Litestream** (the deferred plan in
  [02-hosting-railway.md](./02-hosting-railway.md)) works again: a SQLite file
  can only have one owner, and here there is only one.
- A **self-hosted libSQL server** (`sqld`) as its own Railway service would
  also work, and would keep the current client code.

Two apps sharing one SQLite file is not possible — a Railway volume mounts to
one service only, and a Cloudflare Worker cannot reach it at all. The
publish model is what makes the single owner possible.

## Chat

The chat ([01-chat.md](./01-chat.md)) is the hardest part, and still
tractable:

- **Realtime:** a Cloudflare Durable Object per chat room holds the
  WebSockets and brings its own SQLite storage — the separate chat database
  01 asks for.
- **Posting needs a valid session:** the Durable Object checks it once, when
  the WebSocket connects, through the one real server-to-server endpoint the
  app would offer: `validateSession`.
- **The chat must survive navigation** (connection, scroll, unsent draft).
  A multi-page site reloads on every click, so navigation would swap only
  `<main>` via `fetch` and leave the chat panel mounted. The PoC's background
  refresh already does exactly this swap (`apply()` in `client/app.js`,
  keeping open disclosures and focus); navigation would reuse it — and only
  where a chat panel is docked.
- **The chat's own code** loads only for logged-in players, and may use a
  small framework of its own; guests pay nothing for it.

## Alternative: one Node server, two apps

The app already runs on a hand-built Node server (`apps/web/server/app.ts`:
gzip, static files, then the React Router handler). That server could serve
**both** — the React Router app as the back office, and the lean public site
beside it — with no Cloudflare involved. The proof of concept only used a
Worker because that was allowed for it, not because the design needs one.

**How:** a dispatch step in front of the existing chain. `/manager`,
`/login`, `/logout` and the resource routes go to React Router; everything
else goes to the public handler — a plain `Request → Response` function
rendering templates. `createRequestListener` from
`@remix-run/node-fetch-server`, which the server already uses, binds exactly
that kind of function to Node, so the PoC's rendering code carries over
largely as is; only its data source changes from the legacy API to the
database. The public routes leave the React Router config, which shrinks to
the back office and the login.

**What gets simpler compared with the Worker:**

- **One process, one origin.** Login, session and cookie work as they do
  today — no subdomain cookie, no `validateSession` endpoint, no second set
  of secrets.
- **No publish pipeline.** The public handler reads the database directly.
  If rendering ever needs it, finished HTML can be cached in memory — and
  since every write happens in the same process (the app's actions), an
  action can clear that cache directly. The invalidation problem that
  options C and D work around disappears.
- **The database question gets easy.** One process is one owner: SQLite +
  Litestream from [02-hosting-railway.md](./02-hosting-railway.md) fits, and
  a local SQLite file inside the process is about the fastest data source
  there is.
- **The chat has its natural home.** The custom server was built to hold
  WebSockets itself (see 02); public pages keep the `<main>` swap for
  navigation as described under Chat, with no Durable Objects needed.
- **No edge needed.** The players are in Germany; a server in Europe is as
  fast for them as a global edge.

**What it costs:**

- **One deployment unit** — both parts always go live together. For a
  one-person project that is closer to a feature than a cost.
- **Separate assets** for the public site (its CSS and few kilobytes of JS),
  under their own path, apart from the app's Vite assets.
- **A local dev setup running both** — the custom server with the React
  Router part mounted through Vite's middleware mode, since
  `react-router dev` never runs `server/app.ts`. Already solved in practice
  in another project of the same author.

**In the repo** the public site would be its own package (e.g.
`apps/public` or `packages/public-site`) that `server/app.ts` imports,
sharing `packages/db`, `packages/domain` and the theme directly.

## Open questions

- Which hosting shape: Cloudflare Worker with published data, or one Node
  server with the app? The second needs none of the publish, cookie-domain
  and `validateSession` machinery the first does.
- Is there anything a logged-in player should see on the public site beyond
  personalization? If not, the public site needs no session check at all.
- Where exactly does the app publish? Every write that changes public data:
  results, tips once published, extra points, ranking, championship flags.
- Changing the cookie (new domain, slug inside) logs everyone out once — a
  breaking change in the sense of the root `CLAUDE.md`.
- The login rate limit that
  [07-observability.md](./07-observability.md) defers becomes more relevant
  once the login is a redirect target from another site.
