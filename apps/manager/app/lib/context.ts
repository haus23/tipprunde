import type { users } from "@tipprunde/db/schema";
import { createContext } from "react-router";

type User = Pick<typeof users.$inferSelect, "id" | "name" | "role">;

export type { User };
export const userContext = createContext<User>();
