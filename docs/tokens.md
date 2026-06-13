# Design Tokens

## Breakpoints

Custom breakpoints defined in `@tipprunde/theme`. Tailwind's default breakpoints are kept unchanged.

| Token              | Utility prefix | Value            | Origin  |
| ------------------ | -------------- | ---------------- | ------- |
| `--breakpoint-xs`  | `xs:`          | `30rem` (480px)  | Custom  |
| `--breakpoint-sm`  | `sm:`          | `40rem` (640px)  | Default |
| `--breakpoint-md`  | `md:`          | `48rem` (768px)  | Default |
| `--breakpoint-lg`  | `lg:`          | `64rem` (1024px) | Default |
| `--breakpoint-xl`  | `xl:`          | `80rem` (1280px) | Default |
| `--breakpoint-2xl` | `2xl:`         | `96rem` (1536px) | Default |

All breakpoints are mobile-first (`min-width`). Use `max-xs:`, `max-sm:` etc. for max-width variants.

## Easing

| Token        | Utility    | Value                            | Use case                                                      |
| ------------ | ---------- | -------------------------------- | ------------------------------------------------------------- |
| `--ease-out` | `ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | All UI interactions (overrides Tailwind's default `ease-out`) |

No other easing tokens — `ease-in-out` and `linear` retain their Tailwind defaults.

## Shadows

| Token              | Utility          | Use case                          |
| ------------------ | ---------------- | --------------------------------- |
| `--shadow-popover` | `shadow-popover` | Dropdowns, popovers, select menus |
| `--shadow-overlay` | `shadow-overlay` | Dialogs, modals, drawers          |

No other shadow values — cards and inputs rely on border + background contrast.

## Border Radius

| Token         | Utility      | Value     | Use case                            |
| ------------- | ------------ | --------- | ----------------------------------- |
| `--radius-md` | `rounded-md` | `0.5rem`  | Content: cards, dropdowns, modals   |
| `--radius-sm` | `rounded-sm` | `0.25rem` | Components: buttons, inputs, badges |

## Typography

Font sizes use Tailwind v4's default scale. Line-heights are unitless
`calc(lineHeight / fontSize)` ratios (Tailwind's own form), so they scale with
the font-size instead of locking an absolute value.

**Convention: body content carries an explicit `text-base`.** Readable content —
prose, empty-state messages, data tables — sets `text-base` explicitly rather
than inheriting from `<body>`. Chrome uses fixed `text-sm` / `text-xs`. This
makes `--text-base` a single lever: override it to retune content size without
moving the chrome.

| Layer             | Sizes                  | Examples                                      |
| ----------------- | ---------------------- | --------------------------------------------- |
| Content           | `text-base` (explicit) | prose, empty states, ranking & match tables   |
| Captions / labels | `text-sm`              | nav items, menu items, subtitles, stats lines |
| Micro-labels      | `text-xs`              | table column headers, round meta              |
| Headings          | `text-lg`–`text-3xl`   | page titles, section headers                  |

When adding readable content, set `text-base` on it explicitly — do not rely on
inheritance, or it won't track the token.

### Web app content size

`apps/web` sets a smaller content base in its own `src/styles/app.css` (web-only —
**not** in the shared `@tipprunde/theme`, so the manager is unaffected):

```css
@theme {
  --text-base: 0.875rem; /* 14px — matches the old text-sm */
  --text-base--line-height: calc(1.25 / 0.875); /* Tailwind's text-sm ratio */
}
```

Adjust `--text-base` to experiment with content size; the unitless line-height
ratio keeps the rhythm proportional.
