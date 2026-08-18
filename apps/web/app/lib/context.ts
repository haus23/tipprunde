import type { championships, users } from "@tipprunde/db/schema";
import { createContext } from "react-router";

type User = Pick<typeof users.$inferSelect, "id" | "name" | "slug" | "role">;
type Championship = typeof championships.$inferSelect;

export type { User, Championship };

/** Resolved by the root middleware — null for anonymous visitors. */
export const userContext = createContext<User | null>(null);

/** The manager's working championship (switcher-driven, any publish state). */
export const championshipContext = createContext<Championship>();

/**
 * The championship the public views are scoped to — the running one under `/`,
 * an archived one under `/archiv/:slug`. Set by whichever branch layout
 * matched, so the shared views below work identically in both.
 *
 * Nullable only because middleware runs before the layout's loader can reject:
 * on a miss the layout loader throws, so the views may assert it non-null.
 */
export const viewedChampionshipContext = createContext<Championship | null>(null);
