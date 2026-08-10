// Single-button color-scheme switch, shared by both shells.
// Three stored states (system / light / dark), only two ever shown.
// See docs/color-scheme.md for the model and the state table.
import { Button } from "@tipprunde/ui";
import { MoonIcon, SunIcon } from "lucide-react";
import { useFetcher } from "react-router";

import type { ColorScheme } from "#/lib/color-scheme.ts";

type Resolved = Exclude<ColorScheme, "system">;

/**
 * The OS preference is client-only, so the resolved scheme is read at click
 * time — never ahead of it, which would silently downgrade an explicit choice
 * into a default when the OS changes.
 */
function readSchemes(): { resolved: Resolved; system: Resolved } {
  const stored = (document.documentElement.getAttribute("data-color-scheme") ??
    "system") as ColorScheme;
  const system: Resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return { resolved: stored === "system" ? system : stored, system };
}

export function ColorSchemeToggle() {
  const fetcher = useFetcher();

  function toggle() {
    const { resolved, system } = readSchemes();
    const desired: Resolved = resolved === "dark" ? "light" : "dark";
    // Prefer "system" whenever it already yields the desired appearance — the
    // cookie stays absent and the OS keeps steering. Deriving the next state
    // from the desired *appearance* (rather than just clearing an existing
    // override) also guarantees every click changes something, and drops a
    // stale override when the OS has since moved to match it.
    const next: ColorScheme = system === desired ? "system" : desired;

    // Optimistic: flip the attribute now so there is no wait for revalidation.
    document.documentElement.setAttribute("data-color-scheme", next);
    void fetcher.submit({ scheme: next }, { method: "post", action: "/color-scheme" });
  }

  return (
    <Button intent="ghost" size="icon" onPress={toggle}>
      {/*
        Icon and label are CSS-driven on purpose: while "system" is stored the
        server cannot know the resolved scheme, so picking either in JS would
        mismatch on hydration or flash on first paint. `dark:` already means
        *resolved* dark, so this also follows OS changes with no JS at all.
      */}
      <span className="relative block size-4">
        <SunIcon
          aria-hidden
          className="absolute inset-0 size-full transition-[transform,opacity] ease-out dark:scale-75 dark:opacity-0"
        />
        <MoonIcon
          aria-hidden
          className="absolute inset-0 size-full scale-75 opacity-0 transition-[transform,opacity] ease-out dark:scale-100 dark:opacity-100"
        />
      </span>
      {/* Accessible name — describes the action, and `display:none` keeps the
          inactive one out of the accessibility tree. */}
      <span className="sr-only dark:hidden">Zu dunklem Design wechseln</span>
      <span className="sr-only hidden dark:inline">Zu hellem Design wechseln</span>
    </Button>
  );
}
