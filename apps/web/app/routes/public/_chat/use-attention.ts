import { useSyncExternalStore } from "react";

/**
 * Whether the reader is here: the tab visible *and* the window focused —
 * the same two signals TanStack Query refetches on. A tab that is visible
 * but behind another app (the chat on a second screen while working in an
 * editor) counts as away, as in Slack or Discord: what only passes by in the
 * corner of an eye is not read.
 */
export function useAttention() {
  return useSyncExternalStore(subscribe, isAttending, () => false);
}

function isAttending() {
  return document.visibilityState === "visible" && document.hasFocus();
}

function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  window.addEventListener("focus", onChange);
  window.addEventListener("blur", onChange);
  return () => {
    document.removeEventListener("visibilitychange", onChange);
    window.removeEventListener("focus", onChange);
    window.removeEventListener("blur", onChange);
  };
}
