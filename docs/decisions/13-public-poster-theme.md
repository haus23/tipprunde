# The Public Poster Theme

**Status: built (2026-10-07).** First iteration: light only, public site only.

## Why

The tippers asked for a more striking public site: stronger colors, more
contrast, big distinctive numbers for ranks and points, more character. Not
more density — the information stays the same.

The direction comes from a poster mockup (cream, ink black, red, gold, a
condensed display face). Its palette and type carry through dense UI; its
loud genre devices (thick frames, diagonal red fields, sunbursts) don't, so
they are left out of tables entirely.

## Scope

- **Public only.** Everything outside `/manager`. The manager keeps the
  Sand/Orange look and its light/dark switch — it is a work tool, not a
  show piece.
- **Light only.** The public site is forced to `data-color-scheme="light"`;
  the stored preference keeps applying in the manager. The color-scheme
  toggle is gone from the public header, since it would do nothing. A
  poster dark mode follows only if people miss it.

## How it is scoped

`root.tsx` sets `data-theme="poster"` on `<html>` for every path outside
`/manager`. On `<html>` and not on the public shell's wrapper, because
`<body>` (the page background), the navigation progress bar and every React
Aria popover (portalled to `document.body`) all sit outside that wrapper.
Client navigation between the two areas re-renders the root, so the
attributes switch with the location.

`app.css` overrides the color tokens under `[data-theme="poster"]` — only
the ones that differ; error colors and the rest fall through. This only
works because `@tipprunde/theme` declares its colors with `@theme`, not
`@theme inline`: with `inline`, Tailwind bakes each value into its utility
(`.text-subtle { color: <p3 value> }`) and overriding the variable changes
nothing. Without it, utilities read `var(--text-color-subtle)`. The computed
manager colors were compared before and after the switch: identical.

One trap: a custom property defined in terms of another
(`--text-color-muted: var(--text-color-subtle)`) is resolved where it is
declared — on `<html>` — so a nested scope that changes `subtle` must
repeat `muted` too.

## Palette

| Role            | Value     | Contrast                                  |
| --------------- | --------- | ----------------------------------------- |
| Surface (cream) | `#F2E8D5` | —                                         |
| Text (ink)      | `#15110E` | 15.5:1 on cream                           |
| Subtle (brown)  | `#5A4E40` | 6.7:1 on cream                            |
| Accent text     | `#A81B22` | 6.1:1 on cream                            |
| Accent surface  | `#C82028` | white text 5.7:1                          |
| Accent hover    | `#7A1418` | white text 10.8:1                         |
| Borders (stone) | `#B5A892` | —                                         |
| Gold            | `#E8B53A` | 1.6:1 — decorative only, never the signal |

The accent text is a darker red than the accent surface: the poster's
`#C82028` as text only reaches 4.7:1 on cream.

The **header is an ink band** (`.poster-ink`): the same tokens flipped —
cream text, stone for the inactive links (8.0:1), a lighter red for accent
text (5.6:1) — so the nav links and the user menu needed no class changes
of their own.

Known below AA, not changed: the input placeholder (2.7:1, the theme
package's deliberate 60 % hint) and input borders (1.9:1). Both are weaker
still in Sand/Orange, and the public site has hardly any inputs yet.

## Type

**Anton** (OFL), self-hosted via `@fontsource/anton`, latin subset only —
Vite hashes the file, which suits the immutable asset cache. Token
`--font-display`, utility `font-display`. Used for:

- Page titles, via `.poster-title` (caps, slight tracking);
  `.poster-title-bar` adds the short red rule under centered titles
- Ranks and points in `ranking-table.tsx` and `championship-standings.tsx`,
  with a little extra tracking (`0.05em`) so the condensed digits don't run
  together

Anton has a single weight, 400. `.poster-title` sets it explicitly so a
stray `font-semibold` cannot trigger a synthetic bold. Names, prose and all
other UI text stay in the regular face.

## Restrained character

- Ranks 1–3 in red; a gold star next to the leader
- The red rule under the main page titles
- The ink header band

Not in this iteration: poster motifs on show pages (homepage, a season's
final table, a hall of fame), a dark variant, anything in the manager.
