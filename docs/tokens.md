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

## Border Radius

| Token         | Utility      | Value     | Use case                            |
| ------------- | ------------ | --------- | ----------------------------------- |
| `--radius-md` | `rounded-md` | `0.5rem`  | Content: cards, dropdowns, modals   |
| `--radius-sm` | `rounded-sm` | `0.25rem` | Components: buttons, inputs, badges |
