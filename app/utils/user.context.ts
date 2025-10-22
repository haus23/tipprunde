import { createContext } from "react-router";
import type { User } from "./db/users";

export const userContext = createContext<User | null>(null);
