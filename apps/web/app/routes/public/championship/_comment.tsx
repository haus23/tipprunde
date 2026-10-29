import { cx } from "@tipprunde/ui";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "react-aria-components";
import { flushSync } from "react-dom";
import { useLocation } from "react-router";

import type { TurnierComment } from "#/lib/content.server.ts";

/**
 * The Stadionsenf as what it is: commentary beside the table, not part of it.
 * Same voice on every size — red label, poster title — but a different frame:
 * a column set off by a red rule beside the table, a full-width band of darker
 * cream under it on smaller screens.
 *
 * A `<!-- fold -->` line in the text folds the rest away beside the table, so
 * a long comment doesn't run far past it. Only there: stacked, nothing follows
 * the comment, so its length gets in nobody's way. Folding is CSS (the rest is
 * `lg:hidden`), so server and client render the same.
 *
 * `#stadionsenf` is the way in from the homepage's teaser: whoever asked to
 * read on gets the text — scrolled to where it sits under the table, and
 * unfolded beside it. See docs/decisions/14-turnier-tabelle-stadionsenf.md.
 */
export function ChampionshipComment({ comment }: { comment: TurnierComment }) {
  const [expanded, setExpanded] = useState(false);
  const folded = comment.fold !== null && !expanded;
  const belowRef = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  // Read in an effect, not during render: the server never sees the hash, so
  // a fresh load with it renders folded and unfolds right after hydration.
  // Coming from the teaser is a client navigation — the layout effect runs
  // before the first paint, nothing flashes.
  useLayoutEffect(() => {
    if (hash === "#stadionsenf") setExpanded(true);
  }, [hash]);

  function expand() {
    flushSync(() => setExpanded(true));
    // The button is gone now; hand keyboard focus to the text it revealed
    // instead of dropping it on <body>.
    belowRef.current?.focus({ preventScroll: true });
  }

  return (
    <aside
      id="stadionsenf"
      className={cx(
        // Under the sticky header when the hash scrolls here. From lg up the
        // comment sits at the top beside the table: a margin taller than the
        // screen keeps the page where it is instead of hiding title and tabs.
        "scroll-mt-20 lg:scroll-mt-[100vh]",
        "bg-surface-raised xs:-mx-4 xs:px-8 px-4 py-8",
        "lg:border-accent lg:mx-0 lg:border-l-2 lg:bg-transparent lg:py-0 lg:pr-0 lg:pl-8",
      )}
    >
      <p className="text-accent text-xs font-semibold tracking-widest uppercase">Stadionsenf</p>
      <h2 className="font-display mt-1 mb-4 text-3xl leading-tight uppercase">{comment.title}</h2>
      {/* Markdown from our own repo, never user input — safe to inject. */}
      {comment.fold ? (
        <>
          <div className="prose" dangerouslySetInnerHTML={{ __html: comment.fold.aboveHtml }} />
          <div
            ref={belowRef}
            tabIndex={-1}
            className={cx(
              "prose mt-4 outline-none",
              folded && "lg:hidden",
              // Only on expand, not on first paint (stacked, it renders from
              // the start): a short fade, so the text arrives, not snaps in.
              expanded && "transition-opacity duration-200 ease-out starting:opacity-0",
            )}
            dangerouslySetInnerHTML={{ __html: comment.fold.belowHtml }}
          />
          {folded && (
            <div className="mt-2 hidden justify-end lg:flex">
              <Button
                onPress={expand}
                className="text-subtle hover:text-app focus-visible:ring-accent cursor-pointer rounded-sm p-1 text-xs transition-colors outline-none focus-visible:ring-2"
              >
                Ganzen Senf lesen ↓
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="prose" dangerouslySetInnerHTML={{ __html: comment.html }} />
      )}
    </aside>
  );
}
