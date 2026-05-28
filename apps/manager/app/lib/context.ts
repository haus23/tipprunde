import type { championships, users } from "@tipprunde/db/schema";
import { createContext } from "react-router";

type User = Pick<typeof users.$inferSelect, "id" | "name" | "role">;
type Championship = typeof championships.$inferSelect;

export type { User, Championship };

export const userContext = createContext<User>();
export const championshipContext = createContext<Championship>();
