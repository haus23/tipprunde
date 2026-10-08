# The Public Poster Theme

**Status: built (2026-10-08).** Public site only, light and dark.

First iteration (2026-10-07) was light only with an ink-black header band.
Testers liked the palette, the type and the details, but the black band felt
cut off from the page — on the phone most of all — so it went, and with it
the light-only restriction (see "Dark mode" below).

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
- **Light and dark, both user-controlled.** The poster tokens are
  `light-dark()` pairs like the base theme, so the public site follows the
  user's own choice (the same single-button switch as in the manager, back in
  the public header).

## How it is scoped

`root.tsx` sets `data-theme="poster"` on `<html>` for every path outside
`/manager`; `data-color-scheme` comes from the user's cookie everywhere. On `<html>` and not on the public shell's wrapper, because
`<body>` (the page background), the navigation progress bar and every React
Aria popover (portalled to `document.body`) all sit outside that wrapper.
Client navigation between the two areas re-renders the root, so the
theme attribute switches with the location.

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

| Role           | Light     | Dark      | Contrast (light / dark)                  |
| -------------- | --------- | --------- | ---------------------------------------- |
| Surface        | `#F2E8D5` | `#15110E` | cream / warm ink                         |
| Raised, hover  | `#EBDFC7` | `#1E1914` |                                          |
| Text           | `#15110E` | `#F2E8D5` | 15.5 / 15.5                              |
| Subtle         | `#5A4E40` | `#B5A892` | 6.7 / 8.0                                |
| Accent text    | `#A81B22` | `#F1666A` | 6.1 / 5.6                                |
| Accent surface | `#C82028` | `#C82028` | white text 5.7 in both                   |
| Accent hover   | `#7A1418` | `#D62B33` | white text 10.8 / 4.9                    |
| Borders        | `#B5A892` | `#3A3128` | separators only                          |
| Gold           | `#E8B53A` | `#E8B53A` | 1.6 / 9.9 — decorative, never the signal |

The accent text is a darker red than the accent surface in light mode: the
poster's `#C82028` as text only reaches 4.7:1 on cream. In dark mode it is a
lighter red instead, for the same reason on ink.

Known below AA, not changed: the input placeholder (2.7:1, the theme
package's deliberate 60 % hint) and input borders (1.9:1). Both are weaker
still in Sand/Orange, and the public site has hardly any inputs yet. In dark
mode, accent text on the `control` fill (rarely used) is 4.1:1.

## Dark mode

Ink black instead of the cream surface, cream text, the brighter red for
text and borders; the red surface stays `#C82028`. The gold star gains
contrast. The scrollbar colors follow too.

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

Not in this iteration: anything in the manager, and the loud poster devices
below.

## Still open: poster design features

The palette, the type and the details above carry the look. The genre's
louder devices were left out on purpose and are **to be thought about, not
decided** — lines (rules, diagonals, thick frames), the logo's sunburst as a
motif, stars as bullets, halftone textures. The rule that came out of the
first round: they belong on **show pages** — the homepage, a season's final
table, a hall of fame, the login and error pages — and never in dense tables
or forms, where they would cost legibility for nothing. The red rule under
the page titles is the one such device already in; it is the yardstick for
how much is enough. Collected in [backlog.md](../backlog.md).

## Tried and dropped

- **An ink-black header band** (`.poster-ink`, the same tokens flipped inside
  the header). It looked sharp on desktop but cut off from the page, on the
  phone most of all. The header is now an ordinary surface with a border,
  like the rest of the page.
- **Light only.** A forced `data-color-scheme="light"` on the public site and
  no switch in its header. Replaced once the palette had a dark side.
