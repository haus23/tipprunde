import { Button, cx } from "@tipprunde/ui";
import { ArrowDownIcon, SendHorizontalIcon, XIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { type ChatMessage, mockHistory, mockIncoming } from "./mock.ts";
import { useAttention } from "./use-attention.ts";
import { useStickToBottom } from "./use-stick-to-bottom.ts";

const PAGE_SIZE = 40;
/** A new author line after this long a pause, even from the same sender. */
const GROUP_GAP_MS = 5 * 60 * 1000;
/** Mock only: how often someone else "writes". */
const INCOMING_EVERY_MS = 25_000;

const timeFormat = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });
const dayFormat = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function dayKey(date: Date) {
  return date.toDateString();
}

function dayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dayKey(date) === dayKey(today)) return "Heute";
  if (dayKey(date) === dayKey(yesterday)) return "Gestern";
  return dayFormat.format(date);
}

type Props = {
  /** The logged-in user's name — shown on their own messages. */
  userName: string;
  initialUnread: number;
  open: boolean;
  onClose: () => void;
  onUnreadChange: (unread: number) => void;
};

/**
 * The chat itself: header, transcript, composer. Rendered inside the shell's
 * drawer and never unmounted once opened, so draft and scroll position
 * survive closing it. Runs on mocked data — no server involved yet.
 */
export default function ChatPanel({
  userName,
  initialUnread,
  open,
  onClose,
  onUnreadChange,
}: Props) {
  const [messages, setMessages] = useState(() => mockHistory());
  const [start, setStart] = useState(() => Math.max(0, messages.length - PAGE_SIZE));
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [lastReadId, setLastReadId] = useState(() => {
    const fromOthers = messages.filter((m) => m.author !== null);
    return fromOthers.at(-initialUnread - 1)?.id ?? 0;
  });
  const [draft, setDraft] = useState("");

  const { scrollerRef, contentRef, atBottom, scrollToBottom, preparePrepend } = useStickToBottom();
  const topRef = useRef<HTMLDivElement>(null);

  const visible = messages.slice(start);
  const hasOlder = start > 0;
  const unread = useMemo(
    () => messages.filter((m) => m.id > lastReadId && m.author !== null).length,
    [messages, lastReadId],
  );

  useEffect(() => onUnreadChange(unread), [unread, onUnreadChange]);

  // The reader is here: the chat on screen (open, or docked) and the tab
  // visible and focused. Only then does anything count as read.
  const attending = useAttention();
  const present = open && attending;

  // "Neu" marks the first message the reader had not seen when they arrived —
  // opening the chat, or coming back to the tab or window (docked, the chat
  // never reopens, so returning is its "open"). It is a fixed message, not
  // "everything after the last read one": what arrives while the reader
  // watches is read live and gets no line of its own. It stays put while the
  // new messages get read, and moves only on the next arrival; sending clears
  // it — whoever writes is caught up.
  const lastReadRef = useRef(lastReadId);
  const messagesRef = useRef(messages);
  useEffect(() => {
    lastReadRef.current = lastReadId;
    messagesRef.current = messages;
  }, [lastReadId, messages]);
  const [markerId, setMarkerId] = useState<number | null>(null);
  useEffect(() => {
    if (!present) return;
    const firstUnread = messagesRef.current.find(
      (m) => m.id > lastReadRef.current && m.author !== null,
    );
    setMarkerId(firstUnread?.id ?? null);
  }, [present]);

  // More unread than fit below it: open at the marker, not at the end, so the
  // first new message is not scrolled past unseen.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const marker = scroller?.querySelector<HTMLElement>("[data-unread-marker]");
    if (!scroller || !marker) return;
    const markerTop = marker.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    if (markerTop < 0) scroller.scrollTop += markerTop - 8;
    // Only when the marker is (re)placed — not on every new message.
  }, [scrollerRef, markerId]);

  // Mock only: someone else writes now and then.
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages((current) => [...current, mockIncoming(current.at(-1)!.id + 1)]);
    }, INCOMING_EVERY_MS);
    return () => clearInterval(timer);
  }, []);

  // Older history comes in when the top of the list nears the view.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const top = topRef.current;
    if (!scroller || !top || !hasOlder || isLoadingOlder) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsLoadingOlder(true);
        // Mock latency — about what a local database answers in, so the
        // feel stays honest.
        setTimeout(() => {
          preparePrepend();
          setStart((current) => Math.max(0, current - PAGE_SIZE));
          setIsLoadingOlder(false);
        }, 150);
      },
      // A whole view ahead: the next page should be in before a fast scroll
      // reaches the top. Inserting it then corrects the scroll position, and
      // mid-fling that correction feels like a jump — on a Mac trackpad the
      // remaining momentum even carries on through the new messages.
      { root: scroller, rootMargin: "100% 0px 0px 0px" },
    );
    observer.observe(top);
    return () => observer.disconnect();
  }, [scrollerRef, preparePrepend, hasOlder, isLoadingOlder]);

  // A message counts as read once it has been on screen while the reader was
  // present. Recreated on arrival, so whatever is already in view gets
  // reported at once — after the marker effect above has taken its snapshot.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!present || !scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset["id"]));
        if (seen.length) setLastReadId((current) => Math.max(current, ...seen));
      },
      { root: scroller, threshold: 0.6 },
    );
    for (const row of scroller.querySelectorAll("[data-id]")) observer.observe(row);
    return () => observer.disconnect();
  }, [present, scrollerRef, visible.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    const id = messages.at(-1)!.id + 1;
    setMessages((current) => [...current, { id, author: null, body, createdAt: new Date() }]);
    setLastReadId(id);
    setMarkerId(null);
    setDraft("");
    // Your own message always brings you back to the end.
    scrollToBottom();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-subtle flex h-14 shrink-0 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Chat</h2>
        <Button
          intent="ghost"
          size="icon"
          onPress={onClose}
          // Docked, the chat is always there — nothing to close.
          className="dock:hidden m-0 size-8 p-0"
        >
          <XIcon aria-hidden className="size-4" />
          <span className="sr-only">Chat schließen</span>
        </Button>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* Vertical only: contained on both axes it also swallows the
            browser's sideways swipe-back gesture over the list. */}
        <div
          ref={scrollerRef}
          className="h-full overflow-y-auto overscroll-y-contain [overflow-anchor:none]"
        >
          <div ref={contentRef} className="px-4 pb-3">
            {/* Fixed height whatever it shows: a row changing size above the
                view would shift everything below it. */}
            <div ref={topRef} className="text-subtle flex h-10 items-center justify-center text-xs">
              {isLoadingOlder ? "Lädt ältere Nachrichten …" : hasOlder ? "" : "Anfang des Chats"}
            </div>
            <div role="log" aria-label="Nachrichten">
              {visible.map((message, i) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  previous={visible[i - 1]}
                  isFirstUnread={message.id === markerId}
                  userName={userName}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          intent="secondary"
          onPress={() => scrollToBottom()}
          className={cx(
            "bg-surface-raised shadow-popover absolute right-4 bottom-3 size-9 rounded-full p-0",
            // Keeps the Button's own hover and press transitions alongside.
            "transition-[opacity,transform,background-color] duration-150",
            atBottom && "pointer-events-none translate-y-2 opacity-0",
          )}
          // Out of the tab order while it is invisible.
          excludeFromTabOrder={atBottom}
        >
          <ArrowDownIcon aria-hidden className="size-4" />
          <span className="sr-only">Zu den neuesten Nachrichten</span>
          {unread > 0 && (
            <span className="bg-accent text-accent-fg absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums">
              {unread}
            </span>
          )}
        </Button>
      </div>

      <form
        className="border-subtle flex shrink-0 items-end gap-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends on a real keyboard; on touch screens it is a line
            // break and the button sends, as in every messenger.
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing &&
              !window.matchMedia("(pointer: coarse)").matches
            ) {
              event.preventDefault();
              send();
            }
          }}
          rows={1}
          aria-label="Nachricht"
          placeholder="Nachricht"
          // field-sizing grows the box with its text — progressive
          // enhancement (not Baseline yet); without it the single row
          // scrolls internally.
          className="border-subtle bg-control placeholder:text-placeholder focus-visible:ring-accent [field-sizing:content] max-h-32 min-h-9 flex-1 resize-none rounded-md border px-3 py-1.5 text-base outline-none focus-visible:ring-2 sm:text-sm"
        />
        <Button
          type="submit"
          isDisabled={!draft.trim()}
          // Nothing to send reads as neutral, not as a faded accent.
          className="disabled:bg-control disabled:text-subtle size-9 shrink-0 p-0 disabled:opacity-100"
        >
          <SendHorizontalIcon aria-hidden className="size-4" />
          <span className="sr-only">Senden</span>
        </Button>
      </form>
    </div>
  );
}

function MessageRow({
  message,
  previous,
  isFirstUnread,
  userName,
}: {
  message: ChatMessage;
  previous: ChatMessage | undefined;
  isFirstUnread: boolean;
  userName: string;
}) {
  const isOwn = message.author === null;
  const newDay = !previous || dayKey(previous.createdAt) !== dayKey(message.createdAt);
  const newGroup =
    newDay ||
    isFirstUnread ||
    previous.author !== message.author ||
    message.createdAt.getTime() - previous.createdAt.getTime() > GROUP_GAP_MS;

  return (
    <div data-id={message.id}>
      {newDay && (
        <div className="text-subtle flex items-center gap-3 pt-4 pb-1 text-xs">
          <span className="border-subtle flex-1 border-t" />
          {dayLabel(message.createdAt)}
          <span className="border-subtle flex-1 border-t" />
        </div>
      )}
      {isFirstUnread && (
        <div
          data-unread-marker
          className="text-accent flex items-center gap-3 pt-4 pb-1 text-xs font-semibold"
        >
          <span className="border-accent flex-1 border-t" />
          Neu<span className="sr-only"> – ungelesene Nachrichten ab hier</span>
        </div>
      )}
      <div
        className={cx(
          "flex flex-col",
          isOwn ? "items-end" : "items-start",
          newGroup ? "pt-3" : "pt-1",
        )}
      >
        {newGroup && (
          <div className="text-subtle mb-0.5 px-1 text-xs">
            <span className="text-app font-semibold">{isOwn ? userName : message.author}</span>{" "}
            {timeFormat.format(message.createdAt)}
          </div>
        )}
        <p
          data-scroll-anchor
          className={cx(
            "max-w-[85%] rounded-md px-3 py-1.5 text-sm break-words whitespace-pre-wrap",
            isOwn ? "bg-accent-subtle" : "bg-surface-raised",
          )}
        >
          {message.body}
        </p>
      </div>
    </div>
  );
}
