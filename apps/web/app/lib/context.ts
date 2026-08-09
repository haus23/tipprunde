import type { championships, users } from "@tipprunde/db/schema";
import { createContext } from "react-router";

type User = Pick<typeof users.$inferSelect, "id" | "name" | "slug" | "role">;
type Championship = typeof championships.$inferSelect;

export type { User, Championship };

/** Resolved by the root middleware — null for anonymous visitors. */
export const userContext = createContext<User | null>(null);

/** The manager's working championship (switcher-driven, any publish state). */
export const championshipContext = createContext<Championship>();

/** The public site's championship — latest published one, null if none is. */
export const publicChampionshipContext = createContext<Championship | null>(null);
