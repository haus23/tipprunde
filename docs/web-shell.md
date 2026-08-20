# Public Shell & Header

Responsive layout spec for the **public shell** — `routes/public/_layout.tsx`,
which wraps everything outside `/manager`. (The manager has its own shell with a
sidebar; the two share only the document and the color-scheme mechanism.)
Describes the header contents, the navigation strategy, and the planned chat
panel's docked/drawer behaviour. Breakpoint _values_ live in
[tokens.md](./tokens.md); this doc describes how the shell uses them.

Built today: header, nav, color-scheme toggle, user area. The chat panel is
planned — see [01-chat.md](./decisions/01-chat.md). View Transitions were considered and
postponed — see "View Transitions — postponed" below.

## Header contents (widest state)

Everything a user can reach from the header at max width:

- **Home link** (logo) — leftmost, always visible
- **Primary nav** — Tabelle · Spieler · Spiele
- **Chat** — see "Chat as a layout citizen" below (not a header item on wide screens)
- **Scheme control** — single control (see consolidation note)
- **User menu / Login** — rightmost, always visible

### Consolidations

Two things deliberately do **not** get their own top-level header slot:

1. **Scheme control is one button.** A single sun/moon control toggles between light
   and dark; "system" is reached implicitly, without occupying a slot of its own — see
   [03-color-scheme.md](./decisions/03-color-scheme.md). Two always-visible theming buttons, or a
   three-item menu, would spend scarce header width on a rarely-touched setting.
2. **Manager link + Logout live inside the user menu.** Manager is role-gated (only
   managers/admins see it) and rarely clicked; Logout is by definition an account
   action. Logged out → "Login"; logged in → avatar/name → { Manager (if role), Logout }.

### Two distinct menus

Keep these separate — they have different jobs:

- **User menu** (right cluster) — identity/account: Manager, Logout, profile actions.
- **⋯ overflow menu** — navigation items that didn't fit at the current width.

Do not merge them into one "everything" menu; it muddies what the ⋯ means.

## Navigation

Three short items (Tabelle · Spieler · Spiele) fit at every practical width, so
there is **no overflow menu** — the nav is always fully visible. No ⋯ button, no
duplicate rendering, no collapse logic.

## Chat as a layout citizen

Chat is high priority and **always visible on wide screens** — it is a layout region,
not a header action. The header "chat toggle" is only the narrow-screen affordance to
reveal it.

- **Docked (wide):** fixed-width rail (~320–360px) on the right, in-flow beside the
  main column.
- **Drawer (narrow):** the 💬 toggle appears in the header; chat slides in as an
  **overlay with a backdrop** (do not push/squeeze the main column — there is no room).

### Dock breakpoint ≈ `lg` (1024px)

Derived, not guessed. The main column needs ~640–680px to stay readable; with a ~340px
rail:

```
main (≈640) + chat (≈340) + gutters ≈ 1000–1024px → lg
```

Below `lg`, docking would starve the main content, so that is where chat undocks to the
drawer.

### Keep the chat instance mounted

The single most important implementation constraint. Chat has live state — a
websocket/subscription, scroll position, an unsent draft.

- **Do not** build the narrow drawer with a RAC `Modal`/`Dialog` that mounts content on
  open and unmounts on close — that destroys the chat (and its connection/draft) every
  time.
- **Do** keep the chat component always mounted in the tree and switch only its
  _positioning_ by breakpoint: in-flow grid column on wide; `position: fixed` +
  off-canvas transform on narrow, toggled by state/class. Same instance, relocated.
- Because the keep-mounted route bypasses RAC's Dialog, the narrow overlay owes its own
  a11y: focus the panel on open, `inert`/`aria-hidden` the rest, close on Escape and
  backdrop click.

## Responsive cascade

The header has **independent thresholds**, not one switch. Chat (widest consumer)
collapses first; nav collapses later.

| Width         | Chat             | Nav              | Right cluster             |
| ------------- | ---------------- | ---------------- | ------------------------- |
| ≥ `lg` (1024) | docked rail      | inline (3 items) | Scheme · User             |
| `md`–`lg`     | 💬 drawer toggle | inline           | Scheme · User             |
| < `md`        | 💬 drawer toggle | inline           | Scheme · User             |
| < `xs` (480)  | 💬 drawer toggle | inline           | Scheme may fold into User |

## Shell max-width

When docked, chat and the main column sit side by side, so the outer shell max-width is
**content-max + chat-width**, not just content-max. If main content caps around
`max-w-5xl` (1024px), the shell with the rail wants ~**1360–1400px** total, so the pair
stays centred as a unit on ultra-wide screens rather than the chat drifting to the edge.

## Perceived performance

RR8 Framework Mode gives route-level code splitting and single-fetch navigation for
free. On top of that, every navigational `<Link>`/`<NavLink>` outside `/manager` sets
`prefetch="intent"` (hover/focus triggers the route module + loader fetch ahead of the
click) — nav items, the header logo, dashboard section links, and the Spiele
prev/next/back links. `NavigationProgress` is deliberately delayed so a prefetched nav
doesn't flash a spinner it doesn't need — see its own comment.

Further additions were considered and deliberately left out for now — low stakes at
this traffic scale (a friends' pool on Turso SQLite), revisit if a page ever feels slow:

- **`headers()` / `Cache-Control` on loaders.** Nothing sets one today, so every visit
  re-queries Turso even for content that can't change (a completed Archiv championship).
  Cheapest lever left on the table if it's ever worth pulling.
- **Streaming (`Suspense`/`Await`/`defer`).** Not needed yet — the dashboard loader
  already runs its four queries with `Promise.all`, and nothing is slow enough to want
  unblocking the shell for.
- **`clientLoader` / `shouldRevalidate` tuning.** Every navigation revalidates
  everything, including near-static reference data (teams, rulesets).

## View Transitions — postponed (2026-08-12)

Considered, deliberately **not built**. About perceived smoothness (animated swap vs.
hard cut) rather than load latency, so it's independent of the perceived-performance
work above.

**Constraint that shaped this:** the browser's `document.startViewTransition()` must
wrap the exact moment the DOM swaps — it snapshots "old", runs a callback that
synchronously mutates the DOM, then snapshots "new". For a page-to-page route change,
only the router controls that moment. RR8's `unstable_viewTransition` (the `<Link
viewTransition>` prop, `unstable_useViewTransitionState`) works only because RR8's
client runtime has its own hands on that internal commit and wraps it in
`flushSync(() => startViewTransition(...))` for you.

The explicit ask was to build this **without** RR8's `viewTransition` API, since RR8
plans to retire it once React's own `<ViewTransition>` component stabilizes (see
[remix-run/react-router#15371](https://github.com/remix-run/react-router/discussions/15371)).
This app also runs Framework Mode with the default client entry (no
`entry.client.tsx`), so nothing outside RR8 has access to that commit moment —
reimplementing route-level crossfades ourselves would mean either ejecting the client
entry to reach into router internals (not simple, and fragile against future RR8
changes), or using the very API we're trying to avoid.

What _is_ fully reachable without any RR8 involvement: transitions on **local state
this app already owns outright**, where the "moment" is just our own `setState` —
`document.startViewTransition(() => flushSync(() => setX(next)))` needs no framework
hook at all. Candidates, if this gets picked back up: the color-scheme toggle
(crossfade instead of a hard flip), the manager sidebar collapse, the Spiele match
accordion, Disclosure/popover open-close.

Three options were on the table when this was shelved:

1. **Local UI transitions only** — the candidates above, zero RR8 coupling, nothing to
   swap out later.
2. **Eject `entry.client.tsx` for real route crossfades** — reach into the router
   directly. Gets page-to-page transitions but adds a maintained file the app
   otherwise doesn't need, plus fragility against RR8 internals changing.
3. **Use RR8's `viewTransition` prop anyway** — simplest code today, but it's exactly
   the API this was meant to avoid.

No option was chosen — revisit by rereading this section, not by re-deriving the
constraint above.
