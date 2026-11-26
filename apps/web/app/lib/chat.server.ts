import type { User } from "./context.ts";

/**
 * Feature flag while the chat is being built — UI only, on mocked data (see
 * docs/decisions/01-chat.md). Set `CHAT` per environment:
 *
 * - unset → off for everyone
 * - `admins` → admins only, so the work in progress can ride along on `main`
 *   and be tried on a real phone in production without anyone else seeing it
 * - `on` → every logged-in player
 *
 * Chat is for logged-in players only, so anonymous visitors never get it.
 * The flag goes away when the chat ships.
 */
const CHAT = process.env["CHAT"];

export type ChatSummary = {
  /** Messages from others the user has not seen yet — drives the header badge. */
  unread: number;
};

export function getChatSummary(user: User | null): ChatSummary | null {
  if (!user) return null;
  const enabled = CHAT === "on" || (CHAT === "admins" && user.role === "admin");
  if (!enabled) return null;
  // Mocked until the chat database exists; the panel's mock history marks the
  // same number of trailing messages as unread.
  return { unread: 3 };
}
