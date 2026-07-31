import type { championships, users } from "@tipprunde/db/schema";
import { createContext } from "react-router";

type User = Pick<typeof users.$inferSelect, "id" | "name" | "slug" | "role">;
type Championship = typeof championships.$inferSelect;

export type { User, Championship };

/** Resolved by the root middleware — null for anonymous visitors. */
export const userContext = createContext<User | null>(null);
export const championshipContext = createContext<Championship>();
