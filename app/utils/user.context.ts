import { createContext } from "react-router";

type User = {
  id: number;
  email: string;
  name: string;
  roles: string;
};

export const userContext = createContext<User | null>(null);
