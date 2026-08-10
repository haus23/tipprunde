# Color Scheme Switch

**Status: built** (`app/components/color-scheme-toggle.tsx`). Replaced the two
different controls — the public shell's three-item RAC menu (`ColorSchemeMenu`,
deleted) and the manager header's light/dark toggle — with **one shared
single-button switch** used by both shells.

Follows the argument in
[Lea Verou, "Dark mode toggles: two states are enough"](https://lea.verou.me/blog/2026/dark-mode-toggles/)
(2026-08-06): a three-state control exposes implementation detail rather than
serving a need. The underlying model stays three-state; only two states are
ever shown.

Storage, cookie semantics, and the `/color-scheme` action are **unchanged** —
see `lib/color-scheme.ts`. This doc covers only the control.

## Model: three stored states, two shown

| Term         | Values                        | Where it lives                                  |
| ------------ | ----------------------------- | ----------------------------------------------- |
| **stored**   | `system` \| `light` \| `dark` | `__color-scheme` cookie; `system` = _no cookie_ |
| **resolved** | `light` \| `dark`             | what the user sees; derived                     |

`resolved` = `stored`, or the OS preference when `stored` is `system`.

The button always renders **resolved** and never reveals which mechanism
produced it.

## Click algorithm

```
onClick:
  resolved       = current resolved value          // read at click time
  desired        = opposite(resolved)
  systemResolved = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  next           = (systemResolved === desired) ? 'system' : desired
```

Then: set `data-color-scheme` on `<html>` optimistically, and submit `next` to
`/color-scheme` (which clears the cookie for `system`).

This is a refinement of the plain "clear the override if there is one, else set
the opposite" rule. It behaves identically in the normal case and fixes one
edge: if `dark` was pinned while the OS was light and the OS later switches to
dark, the plain rule's next click clears the override and **nothing visibly
happens** — a dead click. Deriving `next` from the desired appearance instead
guarantees a visible change on every click and garbage-collects the stale
override on the way.

It also keeps the bias toward `system`: whenever the desired appearance is what
the OS would give anyway, nothing is stored.

The OS preference is read **only at click time** — never to proactively rewrite
stored state, which would silently downgrade an explicit choice into a default.

## State table

`•` marks rows reachable only after the OS changes mid-session.

| stored    | OS    | resolved (shown) | icon | click → stored | then resolved |
| --------- | ----- | ---------------- | ---- | -------------- | ------------- |
| `system`  | light | light            | sun  | `dark`         | dark          |
| `dark`    | light | dark             | moon | `system`       | light         |
| `system`  | dark  | dark             | moon | `light`        | light         |
| `light`   | dark  | light            | sun  | `system`       | dark          |
| • `dark`  | dark  | dark             | moon | `light`        | light         |
| • `light` | light | light            | sun  | `dark`         | dark          |

Steady state it reads as a plain two-state toggle — sun ↔ moon, every click
flips. `system` is where the model parks itself whenever that agrees with the
OS.

## OS changes while the app is open

| stored           | OS flips | Behaviour                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `system`         | either   | page follows automatically, icon flips — **pure CSS**, no JS, no fetch |
| `light` / `dark` | either   | nothing changes; the explicit choice wins and is never auto-cleared    |

The first row is free because `@custom-variant dark` in `@tipprunde/theme`
already resolves `system` through `@media (prefers-color-scheme: dark)`.

## SSR constraint — the icon must be CSS-driven

The server knows `stored` but, when that is `system`, **cannot know
`resolved`**: the OS preference is client-only. Choosing the icon in JS
therefore means a hydration mismatch or a wrong-icon flash on first paint.

Render both icons and let CSS pick. The project's `dark:` variant already means
_resolved_ dark, so it is exactly the right primitive. Both icons are stacked
`absolute inset-0` in a `relative size-4` span and crossfaded, so there is no
layout shift and the swap can animate:

```tsx
<SunIcon className="absolute inset-0 size-full transition-[transform,opacity] ease-out dark:scale-75 dark:opacity-0" />
<MoonIcon className="absolute inset-0 size-full scale-75 opacity-0 transition-[transform,opacity] ease-out dark:scale-100 dark:opacity-100" />
```

Correct on first paint, no JS, and it keeps tracking the OS in `system` mode
for free. `ease-out` resolves to the project's custom curve and the default
150 ms duration sits in the right band for an icon swap — see
[tokens.md](./tokens.md), which also records that nothing here yet honours
`prefers-reduced-motion`.

## Accessibility

The accessible name has the same SSR problem and CSS cannot compute it. Two
visually-hidden spans toggled the same way keep it SSR-safe, since
`display: none` content is excluded from the accessibility tree:

```tsx
<span className="sr-only dark:hidden">Zu dunklem Design wechseln</span>
<span className="sr-only hidden dark:inline">Zu hellem Design wechseln</span>
```

- Plain `<button>`, **not** `aria-pressed` — "pressed" implies a binary whose
  third state would be a lie.
- The name describes the **action**, not the current state.
- No live region: the name changes after activation, which is enough at this
  scale.

## Accepted trade-off

With two states a user whose OS is light can never _pin_ light — they sit on
`system`, so an OS that auto-switches at sunset takes the site with it (and
mirrored for dark). This is inherent to the model, not a defect: the real need
is "make this page light **now**", and pinning against future OS changes is an
implementation detail. It is the one capability lost versus today's three-item
menu.

## Implementation notes

- One shared component for both shells, replacing `ColorSchemeMenu` and the
  manager header's `handleToggle`.
- **Fixed a real gap in the manager:** its old toggle only ever submitted
  `light` or `dark`, so once touched the user was pinned forever — the only way
  back to `system` was the menu on a public page.
- The component takes **no props**: everything shown is CSS-driven, and the
  click handler reads the current state from the `data-color-scheme` attribute
  (which the optimistic update keeps current) plus `matchMedia`. This removed
  the `colorScheme` plumbing from both shells.
- The optimistic `data-color-scheme` update lives in the component; both shells
  previously did their own version of it.
- `lib/color-scheme.ts`, the `/color-scheme` action, and the cookie semantics
  are unchanged. The action already treats `system` as "clear the cookie".

### Gotchas found while building

- The `__color-scheme` cookie is **HttpOnly**, so `document.cookie` cannot see
  or clear it. Verify persistence server-side (curl with a cookie jar), not
  from the console.
- Both shells share one `useFetcher`, so two presses in the _same tick_ abort
  the first request. At any human cadence (tested at 250 ms) the state settles
  correctly and survives a reload; the pathological case is a synthetic
  0 ms double-press.
