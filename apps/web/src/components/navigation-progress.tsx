import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Slim top progress bar shown while a navigation's loaders are pending. Delayed
 * so cache hits and preloaded routes (which resolve in a few ms) don't flash it;
 * it only appears when a load actually makes the user wait (e.g. cold Turso).
 */
export function NavigationProgress() {
  const isPending = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, [isPending]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Lädt"
      className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div className="bg-accent h-full w-2/5 animate-[nav-progress_1s_ease-in-out_infinite] rounded-r-full" />
    </div>
  );
}
