import { cn } from "cn";
import { defineConfig } from "cva/config";

// cn (shadcn's package, not clsx+tailwind-merge) already has the exact
// signature cx wants — join then merge, raw inputs in, one string out — so
// no wrapper needed. See
// https://github.com/joe-bell/cva/releases/tag/v1.0.0-beta.9 for why `cx`
// replaces the old `hooks.onComplete`.
export const { cva, cx } = defineConfig({ cx: cn });
