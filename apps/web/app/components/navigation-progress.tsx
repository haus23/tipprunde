import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

/**
 * Slim top progress bar shown while a navigation's loaders are pending. Delayed
 * so prefetched routes (which resolve in a few ms) don't flash it; it only
 * appears when a load actually makes the user wait (e.g. cold Turso).
 */
export function NavigationProgress() {
  const isPending = useNavigation().state !== "idle";
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
    <progress
      aria-label="Lädt"
      className="fixed inset-x-0 top-0 z-50 block h-0.5 appearance-none overflow-hidden before:block before:h-full before:w-2/5 before:animate-[nav-progress_1s_ease-in-out_infinite] before:rounded-r-full before:bg-(--text-color-accent) before:content-['']"
    />
  );
}
