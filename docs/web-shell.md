# Web App Shell & Header

Responsive layout spec for the **web frontend** (`apps/web`). Describes the header
contents, the navigation collapse strategy, and the chat panel's docked/drawer
behaviour. Breakpoint _values_ live in [tokens.md](./tokens.md); this doc describes
how the shell uses them.

## Header contents (widest state)

Everything a user can reach from the header at max width:

- **Home link** (logo) — leftmost, always visible
- **Primary nav** — Tabelle · Spieler · Spiele
- **Chat** — see "Chat as a layout citizen" below (not a header item on wide screens)
- **Scheme control** — single control (see consolidation note)
- **User menu / Login** — rightmost, always visible

### Consolidations

Two things deliberately do **not** get their own top-level header slot:

1. **Scheme control is one button, not two.** A single sun/moon control opens a small
   menu with Light / Dark / System. This covers both the quick switch and "reset to
   system" in one slot — two always-visible theming buttons would spend scarce header
   width on a rarely-touched setting.
2. **Manager link + Logout live inside the user menu.** Manager is role-gated (only
   managers/admins see it) and rarely clicked; Logout is by definition an account
   action. Logged out → "Login"; logged in → avatar/name → { Manager (if role), Logout }.

### Two distinct menus

Keep these separate — they have different jobs:

- **User menu** (right cluster) — identity/account: Manager, Logout, profile actions.
- **⋯ overflow menu** — navigation items that didn't fit at the current width.

Do not merge them into one "everything" menu; it muddies what the ⋯ means.

## Navigation collapse (Priority+)

Breakpoint-driven, **not** measurement-driven. With a small fixed nav (4 items) we do
not measure widths at runtime — we declare which items collapse at which breakpoint.
This is SSR-clean (no measure-on-hydrate flash) and deterministic.

The nav list is defined once and rendered in two places (inline + inside the ⋯ menu),
each toggled by breakpoint classes.

**Collapse order:** items collapse right-to-left as width shrinks (Spiele first, then Spieler, then Tabelle).

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
| ≥ `lg` (1024) | docked rail      | inline (4 items) | Scheme · User             |
| `md`–`lg`     | 💬 drawer toggle | inline           | Scheme · User             |
| < `sm`/`md`   | 💬 drawer toggle | overflow → ⋯     | Scheme · User             |
| < `xs` (480)  | 💬 drawer toggle | ⋯                | Scheme may fold into User |

## Shell max-width

When docked, chat and the main column sit side by side, so the outer shell max-width is
**content-max + chat-width**, not just content-max. If main content caps around
`max-w-5xl` (1024px), the shell with the rail wants ~**1360–1400px** total, so the pair
stays centred as a unit on ultra-wide screens rather than the chat drifting to the edge.
