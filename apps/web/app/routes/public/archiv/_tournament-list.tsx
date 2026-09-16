import { cx } from "@tipprunde/ui";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppLink } from "#/components/app-link.tsx";
import { formatPoints } from "#/lib/utils.ts";

/** Roughly five rows tall — the box scrolls internally rather than the page growing. */
const BOX_HEIGHT = "13.75rem";
/** Pixels per animation frame while a chevron is hovered. */
const SCROLL_SPEED = 3;
/** One discrete step for a click/keyboard activation of a chevron. */
const SCROLL_STEP = 88;

type ChampionshipEntry = {
  slug: string;
  name: string;
  completed: boolean;
  winners: { name: string; slug: string; total: number }[];
};

/**
 * The Archiv's tournament list: a fixed-height, natively scrollable box
 * instead of a disclosure or pagination — the page itself never grows or
 * shrinks as the list is browsed. Fade masks hint that there is more above
 * or below; the hover chevrons are a mouse/trackpad-only convenience layered
 * on top (touch already scrolls the box directly by swipe, which is why the
 * chevrons hide themselves under `(hover: hover) and (pointer: fine)` rather
 * than being torn down in JS — see Base UI's Select.ScrollUpArrow for the
 * same pattern this borrows).
 */
export function TournamentList({ championships }: { championships: ChampionshipEntry[] }) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  function updateEdges() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 1);
  }

  // Re-checked on mount (SSR has no scroll metrics yet) and whenever the
  // list's own size changes, e.g. once more championships get published.
  useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [championships.length]);

  const frameRef = useRef<number | null>(null);

  function stopScroll() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }

  function startScroll(direction: -1 | 1) {
    stopScroll();
    const step = () => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop += direction * SCROLL_SPEED;
      updateEdges();
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }

  // Unmount safety net — a hover that never fires "leave" (e.g. the pointer
  // leaves via a route change) must not leave the loop running forever.
  useEffect(() => stopScroll, []);

  function nudge(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ top: direction * SCROLL_STEP, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* role="list": Safari (and VoiceOver on it) drops the implicit
          list/listitem role once list-style is removed via CSS — role="list"
          puts it back explicitly rather than relying on list-style alone. */}
      <ul
        ref={scrollRef}
        role="list"
        onScroll={updateEdges}
        className="grid list-none grid-cols-[1fr_auto_auto] gap-x-3 overflow-y-auto pr-3"
        style={{ maxHeight: BOX_HEIGHT }}
      >
        {championships.map((entry) => (
          <li
            key={entry.slug}
            className="border-subtle col-span-3 grid h-11 grid-cols-subgrid items-center border-b text-base last:border-b-0"
          >
            <AppLink href={`/archiv/${entry.slug}`}>{entry.name}</AppLink>
            <div className="text-sm">
              {entry.completed ? (
                entry.winners.map((w, i) => (
                  <span key={w.slug}>
                    {i > 0 && ", "}
                    {w.name}
                  </span>
                ))
              ) : (
                <span className="text-subtle italic">(laufend)</span>
              )}
            </div>
            <div className="text-right font-medium tabular-nums">
              {entry.winners[0] ? `${formatPoints(entry.winners[0].total)} Punkte` : "–"}
            </div>
          </li>
        ))}
      </ul>

      <div
        className={cx(
          "from-surface pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b to-transparent transition-opacity duration-200",
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cx(
          "from-surface pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t to-transparent transition-opacity duration-200",
          canScrollDown ? "opacity-100" : "opacity-0",
        )}
      />

      <button
        type="button"
        aria-label="Nach oben scrollen"
        disabled={!canScrollUp}
        onClick={() => nudge(-1)}
        onPointerEnter={() => startScroll(-1)}
        onPointerLeave={stopScroll}
        className={cx(
          "hidden [@media(hover:hover)_and_(pointer:fine)]:flex",
          "absolute inset-x-0 top-0 h-6 items-center justify-center transition-opacity duration-200",
          canScrollUp ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronUpIcon className="text-subtle size-4" />
      </button>
      <button
        type="button"
        aria-label="Nach unten scrollen"
        disabled={!canScrollDown}
        onClick={() => nudge(1)}
        onPointerEnter={() => startScroll(1)}
        onPointerLeave={stopScroll}
        className={cx(
          "hidden [@media(hover:hover)_and_(pointer:fine)]:flex",
          "absolute inset-x-0 bottom-0 h-6 items-center justify-center transition-opacity duration-200",
          canScrollDown ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronDownIcon className="text-subtle size-4" />
      </button>
    </div>
  );
}
