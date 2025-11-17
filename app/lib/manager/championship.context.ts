import { createContext } from "react-router";
import type { Championship } from "../model/championship";

export const championshipContext = createContext<Championship | null>(null);
