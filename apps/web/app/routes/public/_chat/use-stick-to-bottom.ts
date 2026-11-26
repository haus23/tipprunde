import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Pixels from the bottom that still count as "at the bottom". */
const THRESHOLD = 24;

/**
 * Scroll behaviour of a chat transcript, on plain DOM APIs:
 *
 * - **Follow** new content while the reader is at the bottom; once they
 *   scroll up, stay put and let `atBottom` drive a "to the latest" button.
 * - **Prepend** older history without moving the view: call `preparePrepend()`
 *   right before the state update that inserts the older messages. It holds
 *   on to the topmost visible element marked `data-scroll-anchor` (a message
 *   bubble) and puts it back at the same distance from the top — what the
 *   browser's own scroll anchoring does. Anchoring on an element, not on the
 *   total height, keeps it right when something else changes in between: a
 *   message arriving at the bottom, a day separator above the anchor that
 *   disappears because older messages of that day now precede it.
 *
 * Both run from one `ResizeObserver` on the content, whose callbacks fire after
 * layout and before paint — the correction never shows a jumped frame. The
 * scroller sets `overflow-anchor: none`: the browser's own scroll anchoring
 * would correct a second time where it exists, and Safari has none, so it is
 * done by hand for everyone. See docs/decisions/01-chat.md for why this is not
 * a library.
 */
export function useStickToBottom() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const pendingPrepend = useRef<{ anchor: Element; offset: number } | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    scroller.scrollTop = scroller.scrollHeight;
    let lastTop = scroller.scrollTop;

    function onScroll() {
      const top = scroller!.scrollTop;
      const bottom = scroller!.scrollHeight - top - scroller!.clientHeight <= THRESHOLD;
      // Only a move *up* lets go. A smooth scroll to the bottom passes through
      // positions that are not yet the bottom, and must not count as leaving.
      if (top < lastTop - 1) following.current = false;
      if (bottom) following.current = true;
      lastTop = top;
      setAtBottom(bottom);
    }

    const observer = new ResizeObserver(() => {
      const prepend = pendingPrepend.current;
      pendingPrepend.current = null;
      // At the end, history arriving above changes nothing: stay at the end
      // (and take along whatever arrived below in the same frame).
      if (following.current) scroller.scrollTop = scroller.scrollHeight;
      else if (prepend) scroller.scrollTop += offsetIn(scroller, prepend.anchor) - prepend.offset;
    });
    observer.observe(content);
    // The scroller itself shrinks too — the on-screen keyboard, a rotated phone.
    observer.observe(scroller);
    scroller.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    following.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: reduce ? "instant" : behavior });
  }, []);

  const preparePrepend = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top;
    const anchor = [...scroller.querySelectorAll("[data-scroll-anchor]")].find(
      (element) => element.getBoundingClientRect().bottom > top,
    );
    pendingPrepend.current = anchor ? { anchor, offset: offsetIn(scroller, anchor) } : null;
  }, []);

  return { scrollerRef, contentRef, atBottom, scrollToBottom, preparePrepend };
}

/** Distance of an element's top from the scroller's visible top edge. */
function offsetIn(scroller: Element, element: Element) {
  return element.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
}
