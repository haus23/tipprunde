import { createContext } from "react-router";
import type { User } from "../db/_types";

export const userContext = createContext<User | null>(null);
