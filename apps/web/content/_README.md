# Content

Prose that ships with the app — for now the blog, written alongside the legacy
import, because entering the old seasons keeps bringing the anecdotes back.

**Nothing reads this folder yet.** The rendering side is not built; these files
exist so the writing can start before the feature does. The frontmatter rules
below are the part worth getting right today: they are cheap to follow now and
expensive to change once there are thirty files instead of three.

## Files

One post per file, flat — no subfolders until there is a second kind of content
to separate. The **filename is the slug**: `wolfgangs-schwarze-serie.md` →
`/blog/wolfgangs-schwarze-serie`. Deliberately no slug in the frontmatter: one
source of truth, nothing that can drift apart. A date prefix is fine if it helps
sorting in the editor (`2006-11-wolfgangs-…`) — the loader strips it.

Files starting with `_` are not posts. Same convention as the route folders in
`app/`, where `_` marks a file that is not a page of its own.

## Frontmatter

```yaml
---
title: Die Runde, in der Wolfgang alles verlor
date: 2026-09-11
championships: [hr0607]
draft: true
---
```

- **`title`** — the filename carries no umlauts and no punctuation.
- **`date`** — when the piece was _written_, not what it is about. The "about
  when" is carried by `championships`. Fixed this way on purpose, so it does not
  get re-decided per post. ISO, so sorting stays trivial.
- **`championships`** — championship **slugs** (`hr0607`), never `nr`. The slug
  is the stable public identifier and already the URL segment under
  `/archiv/:slug`, so linking comes for free. **Always a list**, even for a
  single entry — widening a scalar to a list later means touching every file.
  Leave the key out entirely for a standalone piece.
- **`draft`** — omit or set `false` to publish. Unfinished thoughts are meant to
  be able to sit in here safely.

Keep it at these four. A field invented now that the app never reads is only
weight to maintain.

## Writing in an external editor

Obsidian's `[[wikilinks]]` and `![[embeds]]` are **not** CommonMark, and no
standard parser understands them. Stick to `[text](url)` and
`![alt](/blog/image.jpg)`, otherwise every file needs fixing later.

Images go to `public/blog/`, referenced by absolute path.

## When this gets built

Two dependencies cover it, both server-side only, both with zero dependencies of
their own: `marked` for the Markdown, `yaml` for the frontmatter block (`yaml` is
already in the tree via Vite, so declaring it costs nothing to install).

Rendering belongs in the build, not in a request: the content lives in the repo,
so changing it needs a deploy either way — request-time parsing would buy
flexibility nobody can spend. React Router's `prerender` covers that without any
further tooling; `react-router.config.ts` does not use it yet.

The decision record slot is `docs/decisions/09-blog.md`.
