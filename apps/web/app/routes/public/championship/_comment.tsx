import { cx } from "@tipprunde/ui";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-aria-components";

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
 */
export function ChampionshipComment({ comment }: { comment: TurnierComment }) {
  const [expanded, setExpanded] = useState(false);
  const folded = comment.fold !== null && !expanded;
  const belowRef = useRef<HTMLDivElement>(null);

  // The button goes away on press; hand keyboard focus to the text it
  // revealed instead of dropping it on <body>.
  useEffect(() => {
    if (expanded) belowRef.current?.focus({ preventScroll: true });
  }, [expanded]);

  return (
    <aside
      className={cx(
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
                onPress={() => setExpanded(true)}
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
