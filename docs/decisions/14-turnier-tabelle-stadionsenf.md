# The Championship Page Is Its Table, With the Stadionsenf Beside It

**Status: built (2026-10-28).** Supersedes the Übersicht part of
[11-turnier-routing-homepage.md](./11-turnier-routing-homepage.md) and the
Übersicht/Tabelle/Verlauf rahmen of
[10-archiv-navigation.md](./10-archiv-navigation.md). The `/turnier` and
`/turnier/:slug` route shape from 11, the season chrome from 10 and the
homepage-as-modules idea from 11 are unchanged.

## The problem

`/turnier[/:slug]` used to be an **Übersicht**: a standings excerpt, the
latest matches, the Stadionsenf comment and the ruleset. It had become a page
of leftovers:

- the **table** was there only as an excerpt, the full one lived at
  `/tabelle`;
- the **latest matches** are what the homepage shows anyway, and matter only
  while a championship runs;
- what was left, the **Stadionsenf** and the **ruleset**, is reading on
  request, not a reason for a page of its own.

And the page was hard to reach: the header's "Tabelle" led to `/tabelle`, so
from the main navigation the Übersicht was only one tab of the rahmen; from
the Archiv, on the other hand, a visitor landed on it directly. Two ways into
a championship, two different first pages.

## The decision

**The championship's own page is its table.** `/turnier` and `/turnier/:slug`
show the full table — the information every visitor comes for, and while a
championship runs the only one that matters.

**The Stadionsenf sits beside the table, in full** — next to it from `lg` up,
under it below that. It is the story of exactly this table, so it belongs on
the same page, not behind a tab where it would read like small print. A
running championship has no comment yet (it is written once the round is
over), so the page then shows the table alone, and nobody misses anything.

**The rahmen's tabs are Tabelle · Verlauf · Regelwerk.** The ruleset is
reference material, a tab is enough; it moved into the rahmen and carries the
link to the Zusatzfragen that used to sit under it on the Übersicht.

> **Update 2026-10-29:** that link left the Zusatzfragen hidden — reachable
> only from the bottom of the ruleset and the table's column header. They are
> meta content about the championship like the ruleset, so they became a tab
> of their own: **Tabelle · Zusatzfragen · Regelwerk · Verlauf**, the
> Zusatzfragen tab only for a ruleset that asks extra questions. The ruleset's
> link went. On narrow screens the tabs wrap instead of squeezing into one
> line.

**The header's "Tabelle" leads to the championship page** and stays lit on its
Verlauf and Regelwerk tabs; Spieler and Spiele stay as they were. The shell
decides which item is active (`_layout.tsx`), because the table's link is the
championship root — a prefix of every other view.

**`/tabelle` redirects** (301) to the championship page, under both mounts,
keeping the query string. Shared and bookmarked links keep working, so this
is a minor, not a major.

## The Stadionsenf as an aside

The comment is commentary on the table, not part of it, and should read that
way — without being turned down: same text size, same colour as any prose.
The difference is a frame and a voice:

- **One voice on every size:** an `<aside>` with a red "Stadionsenf" label and
  the title in the poster face (Anton), like a newspaper column.
- **A frame per layout:** beside the table, a column set off by a red rule;
  stacked under it, a full-width band of darker cream (`surface-raised`), a new
  page after the table. Different frames for one and two columns are fine as
  long as the content and the voice stay the same, and the switch is CSS, so
  server and client render alike.

**Long comments fold, where the author says so.** Beside the table a long
comment runs far past it and leaves a column of nothing on the left. A
`<!-- fold -->` line, on its own between two paragraphs, cuts the text there:
from `lg` up the rest stays hidden behind "Ganzen Senf lesen ↓", which shows
it in place (a short fade, focus moves to the revealed text). Without the
marker the comment shows in full. Stacked, nothing follows the comment, so its
length gets in nobody's way — the marker does nothing there.

**The teaser leads to the text.** Its links point at `#stadionsenf`, the
aside's id: whoever clicked "Weiterlesen" has asked for the comment, so they
get it — stacked, scrolled to under the table; beside it, unfolded, with the
page left at the top (a scroll margin taller than the screen keeps title and
tabs in view). Not CSS `:target`: it does not follow client-side navigation,
so the component reads the hash. A fresh load with the hash renders folded on
the server, which never sees it, and unfolds right after hydration.

The fold is a marker of its own, not `<!-- more -->`: the excerpt answers
"what makes people curious?" for the homepage teaser, the fold "how much fits
beside the table?" — two cuts in different places.

## The homepage

Left the running championship's standings; on the right whatever is current
about it:

- **while it runs:** the latest matches — even if a Stadionsenf already
  exists. As a rule one is only written once the championship is over, but
  that is a habit, not a constraint, and while matches are still being played
  they are what the homepage is for;
- **once it is over and has a Stadionsenf:** a teaser — title, the excerpt
  above a `<!-- more -->` line if the author set one, "Weiterlesen →" to the
  championship page;
- **over, no comment yet:** the last matches, until the comment is there. The
  column never stands empty.

The excerpt follows the same rule as the Nachspielzeit articles (11): set by
hand with `<!-- more -->`, never a guessed first paragraph. Without the marker
the teaser shows the title and the link only.

## Tried and dropped

- **A sticky table** beside a long comment, so the players named in the text
  stay in view. Works only while the table fits the viewport; a table of 16
  already did not at 800px, and its last rows could then only be reached by
  scrolling to the end of the comment. Sticking it by its bottom edge instead
  loses the leaders, scrolling with the reader both ways needs scroll logic.
  Dropped.
- **Folding by height** — the comment cut to the table's height with a fade.
  Dropped for the explicit marker: the author picks the place, and a cut
  between paragraphs needs no fade.
- **An inner scroll area** at the table's height, and **a side sheet** for the
  full text: a scroll box inside the page fights the page's own scrolling, a
  sheet hides the text again.

- **The Stadionsenf as a fourth tab** (Tabelle · Verlauf · Stadionsenf ·
  Regelwerk). Considered first; dropped because the comment would disappear
  among the reference tabs, while it is the one piece of text an archived
  championship is worth opening for.
