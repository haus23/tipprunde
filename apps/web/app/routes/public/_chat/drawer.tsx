import { Button, cx } from "@tipprunde/ui";
import { MessageCircleIcon } from "lucide-react";
import { Suspense, lazy, useEffect, useRef } from "react";

// The panel's code loads on first use, not with every page: most visitors
// never open the chat, and while it is behind the flag most never can.
const loadPanel = () => import("./panel.tsx");
const ChatPanel = lazy(loadPanel);

type ToggleProps = {
  open: boolean;
  unread: number;
  onToggle: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

/** The header's 💬 button, with the unread badge. Warms the panel on intent. */
export function ChatToggle({ open, unread, onToggle, ref }: ToggleProps) {
  return (
    <Button
      ref={ref}
      intent="ghost"
      size="icon"
      onPress={onToggle}
      onHoverStart={() => void loadPanel()}
      onFocus={() => void loadPanel()}
      aria-expanded={open}
      aria-controls="chat-panel"
      // Same 32px square as its header neighbours. Docked, the chat is
      // always on screen and needs no toggle.
      className="dock:hidden relative m-0 size-8 p-0"
    >
      <MessageCircleIcon aria-hidden className="size-4" />
      <span className="sr-only">
        Chat
        {unread === 1
          ? ", 1 ungelesene Nachricht"
          : unread > 1
            ? `, ${unread} ungelesene Nachrichten`
            : ""}
      </span>
      {unread > 0 && (
        <span
          aria-hidden
          className="bg-accent text-accent-fg absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums"
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Button>
  );
}

type DrawerProps = {
  /** Visible: open as a drawer, or docked. */
  open: boolean;
  /** A column beside the content (from the `dock` breakpoint), not an overlay. */
  docked: boolean;
  /** Open without the slide — the page was loaded with the chat open. */
  instant?: boolean;
  /** False until the first open — nothing is loaded before that. */
  mounted: boolean;
  userName: string;
  initialUnread: number;
  onClose: () => void;
  onUnreadChange: (unread: number) => void;
};

/**
 * The chat as an overlay drawer from the right — or, from the `dock`
 * breakpoint, as a column beside the content, always there. One element in
 * one place in the tree for both: only CSS moves it, so nothing remounts when
 * the window crosses the breakpoint. See docs/web-shell.md.
 *
 * Deliberately not a RAC `Modal`: that mounts its content on open and drops
 * it on close, and the chat has to keep its draft and scroll position (later
 * its connection). So the panel stays mounted and only slides; the overlay's
 * duties a Modal would bring are done here — focus on open, Escape and the
 * backdrop close, `inert` keeps the closed panel out of reach. The shell
 * makes the page behind inert while it is open.
 */
export function ChatDrawer({
  open,
  docked,
  instant = false,
  mounted,
  userName,
  initialUnread,
  onClose,
  onUnreadChange,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const modal = open && !docked;

  useEffect(() => {
    if (!modal) return;
    // The dialog itself, not the text box: focusing that would pop up the
    // keyboard on a phone when someone only wants to read.
    panelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modal, onClose]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cx(
          "dock:hidden fixed inset-0 z-40 bg-black/30 transition-opacity ease-out",
          open ? "duration-300" : "pointer-events-none opacity-0 duration-200",
          instant && "transition-none",
        )}
      />
      <div
        ref={panelRef}
        id="chat-panel"
        role={docked ? "complementary" : "dialog"}
        aria-modal={docked ? undefined : true}
        aria-label="Chat"
        tabIndex={-1}
        inert={!open}
        className={cx(
          "bg-surface shadow-overlay fixed inset-y-0 right-0 z-50 w-full max-w-sm outline-none",
          // The iOS sheet curve: quick off the mark, long soft landing. Out
          // faster than in — closing is the system answering, not something
          // to watch. Reduced motion: no slide, the backdrop's fade remains.
          "transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          open ? "duration-300" : "translate-x-full shadow-none duration-200",
          instant && "transition-none",
          // Docked: below the header, flush with the window's right edge —
          // the shell keeps that 24rem free. No slide when the window crosses
          // the breakpoint.
          "dock:top-14 dock:border-subtle dock:z-0 dock:w-96 dock:max-w-none dock:translate-x-0 dock:border-l dock:shadow-none dock:transition-none",
        )}
      >
        {mounted && (
          <Suspense fallback={null}>
            <ChatPanel
              userName={userName}
              initialUnread={initialUnread}
              open={open}
              onClose={onClose}
              onUnreadChange={onUnreadChange}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
