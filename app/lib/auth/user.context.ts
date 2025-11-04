import { createContext } from "react-router";

type User = {
  id: number;
};

export const userContext = createContext<User | null>(null);
