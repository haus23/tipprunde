import { clsx } from "clsx";
import { defineConfig } from "cva/config";
import { twMerge } from "tailwind-merge";

// `hooks.onComplete` is deprecated as of cva@1.0.0-beta.9 in favor of `cx`,
// which now owns the whole join-then-merge step (it receives the raw inputs,
// not a pre-joined string) — see
// https://github.com/joe-bell/cva/releases/tag/v1.0.0-beta.9
export const { cva, cx } = defineConfig({
  cx: (...inputs) => twMerge(clsx(inputs)),
});
