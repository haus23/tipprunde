import antonLatin from "@fontsource/anton/files/anton-latin-400-normal.woff2?url";
import { Logo } from "@tipprunde/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import { championshipBasePath } from "#/components/championship-scope.tsx";
import { ColorSchemeToggle } from "#/components/color-scheme-toggle.tsx";
import { type ChatSummary, getChatSummary } from "#/lib/chat.server.ts";
import type { User } from "#/lib/context.ts";
import { userContext } from "#/lib/context.ts";
import type { loader as rootLoader } from "#/root.tsx";

import type { Route } from "./+types/_layout";
import { ChatDrawer, ChatToggle } from "./_chat/drawer.tsx";
import { PublicNavLink } from "./_nav-link.tsx";
import { NavigationProgress } from "./_navigation-progress.tsx";
import { UserArea } from "./_user-area.tsx";

// `to` is relative to the championship in scope; "" is the championship's
// own page, its table. `section` lists the paths an item stays active on —
// the table also owns the Verlauf and Regelwerk tabs of its rahmen.
const navItems = [
  { to: "", label: "Tabelle", section: ["", "/zusatzfragen", "/regelwerk", "/verlauf"] },
  { to: "/tipps", label: "Spieler", section: ["/tipps"] },
  { to: "/spiele", label: "Spiele", section: ["/spiele"] },
] as const;

function isInSection(pathname: string, basePath: string, section: readonly string[]) {
  return section.some((path) => {
    const target = `${basePath}${path}`;
    return pathname === target || (path !== "" && pathname.startsWith(`${target}/`));
  });
}

// Anton sets every page title and the table's points, all above the fold —
// fetched with the HTML instead of after the CSS, so it is usually there
// before first paint. Same Vite-hashed URL as the @font-face in app.css, so
// the preload is what the font face then uses. Public pages only: the
// manager never shows Anton.
export const links: Route.LinksFunction = () => [
  { rel: "preload", href: antonLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user, chat: getChatSummary(user) };
}

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  return (
    <PublicShell user={loaderData.user} chat={loaderData.chat}>
      <Outlet />
    </PublicShell>
  );
}

/**
 * Errors below this layout keep the shell — a 404 should still look like the
 * site, the way the old web app's notFoundComponent did.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const root = useRouteLoaderData<typeof rootLoader>("root");
  // Present when the error came from below — this layout's own loader ran.
  const layout = useRouteLoaderData<typeof loader>("routes/public/_layout");
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <PublicShell user={root?.user ?? null} chat={layout?.chat ?? null}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <title>{isNotFound ? "Seite nicht gefunden · runde.tips" : "Fehler · runde.tips"}</title>
        <h1 className="poster-title text-2xl">
          {isNotFound ? "Seite nicht gefunden" : "Etwas ist schiefgelaufen"}
        </h1>
        <p className="text-subtle text-sm">
          {isNotFound && typeof error.data === "string" && error.data
            ? error.data
            : isNotFound
              ? "Diese Seite existiert nicht."
              : "Bitte versuche es später noch einmal."}
        </p>
        {/* Never leak internals to visitors — details are a dev affordance. */}
        {import.meta.env.DEV && !isNotFound && (
          <pre className="bg-surface-raised text-subtle max-w-xl overflow-auto rounded-md p-4 text-left text-xs">
            {error instanceof Error ? (error.stack ?? error.message) : String(error)}
          </pre>
        )}
        <Link to="/" className="text-accent text-sm transition-colors hover:underline">
          Zur Startseite
        </Link>
      </div>
    </PublicShell>
  );
}

function PublicShell({
  user,
  chat,
  children,
}: {
  user: User | null;
  /** Null while the chat is off for this user (flag, or not logged in). */
  chat: ChatSummary | null;
  children: React.ReactNode;
}) {
  // The nav follows whichever championship is in scope, so browsing an archived
  // season stays in that season — the same way the manager sidebar keeps to
  // /manager/:slug. Outside any season (/, /archiv, /login, 404) it points at
  // the running one under /turnier.
  const location = useLocation();
  const { pathname } = location;
  const basePath = championshipBasePath(pathname);

  // The open chat is a history entry of its own, `#chat`: Android's back
  // gesture (and the browser's back button) then closes the chat instead of
  // leaving the page beneath it. Opening runs no loaders (adding a hash is a
  // hash-only change to React Router); closing does once — dropping a hash is
  // not, so the page's loaders revalidate. Accepted: one cheap refetch per
  // close, against a `shouldRevalidate` on every public route. The hash never
  // reaches the server, so it only counts once hydrated — otherwise the first
  // client render would differ from the server's.
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // Read from where the router is heading, not where it is: a close waits on
  // that revalidation, and the drawer should not wait with it.
  const target = useNavigation().location ?? location;
  const chatOpen = !!chat && !!user && hydrated && target.hash === "#chat";

  // Mounted on first open, then kept — see ChatDrawer.
  const [chatMounted, setChatMounted] = useState(false);
  if (chatOpen && !chatMounted) setChatMounted(true);
  const [unread, setUnread] = useState(chat?.unread ?? 0);
  const chatToggleRef = useRef<HTMLButtonElement>(null);

  function openChat() {
    void navigate(
      { pathname: location.pathname, search: location.search, hash: "chat" },
      { state: { chatPushed: true }, preventScrollReset: true },
    );
  }

  // Back over the entry we pushed, so closing leaves no stray `#chat` behind
  // for the next "back" to land on. Opened from a link instead, there is no
  // entry of ours to go back over — drop the hash in place.
  const chatPushed = (location.state as { chatPushed?: boolean } | null)?.chatPushed === true;
  const closeChat = useCallback(() => {
    if (chatPushed) void navigate(-1);
    else
      void navigate(
        { pathname: location.pathname, search: location.search },
        { replace: true, preventScrollReset: true },
      );
  }, [chatPushed, navigate, location.pathname, location.search]);

  // Focus goes back to the toggle on close — after the commit: until then the
  // page around it is still inert and refuses focus.
  const wasChatOpen = useRef(false);
  useEffect(() => {
    if (wasChatOpen.current && !chatOpen) chatToggleRef.current?.focus();
    wasChatOpen.current = chatOpen;
  }, [chatOpen]);

  // The page behind the open drawer does not scroll along. (With classic
  // scrollbars the page widens by the scrollbar meanwhile; overlay
  // scrollbars, as on macOS and phones, do not show it.)
  useEffect(() => {
    if (!chatOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [chatOpen]);

  return (
    <>
      <NavigationProgress />
      <div className="flex min-h-svh flex-col" inert={chatOpen}>
        <header className="border-subtle bg-surface sticky top-0 z-10 h-14 border-b">
          <div className="xs:px-4 mx-auto grid h-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center px-2">
            {/* Left: home link */}
            <div className="col-start-1 flex items-center">
              <Link
                to="/"
                prefetch="intent"
                className="focus-visible:ring-accent flex items-center gap-2 rounded px-1 pb-0.5 outline-none focus-visible:ring-2"
              >
                <span className="text-accent size-8">
                  <Logo />
                </span>
                <span className="hidden pr-2 text-sm font-semibold tracking-tight sm:block">
                  runde.tips
                </span>
              </Link>
            </div>
            {/* Center: nav — always visible */}
            <nav className="col-start-2 flex h-full items-center justify-center gap-1">
              {navItems.map((item) => (
                <PublicNavLink
                  key={item.label}
                  to={`${basePath}${item.to}`}
                  isActive={isInSection(pathname, basePath, item.section)}
                >
                  {item.label}
                </PublicNavLink>
              ))}
            </nav>
            {/* Right: scheme + user */}
            <div className="col-start-3 flex items-center justify-end gap-1">
              {chat && user && (
                <ChatToggle
                  ref={chatToggleRef}
                  open={chatOpen}
                  unread={unread}
                  onToggle={() => (chatOpen ? closeChat() : openChat())}
                />
              )}
              {/* Same 32px square as its neighbours: the icon variant's padding
                  trick would paint a 44px hover and focus box. */}
              <ColorSchemeToggle className="m-0 size-8 p-0" />
              <UserArea user={user} />
            </div>
          </div>
        </header>
        <main className="xs:px-4">{children}</main>
      </div>
      {chat && user && (
        <ChatDrawer
          open={chatOpen}
          mounted={chatMounted}
          userName={user.name}
          initialUnread={chat.unread}
          onClose={closeChat}
          onUnreadChange={setUnread}
        />
      )}
    </>
  );
}
