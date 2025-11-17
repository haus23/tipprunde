import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Championship } from "../model/championship";

type ChampionshipContextValue = {
  currentChampionship: Championship | null;
  setCurrentChampionship: (championship: Championship | null) => void;
};

const CurrentChampionshipContext = createContext<ChampionshipContextValue>({
  currentChampionship: null,
  setCurrentChampionship: () => {},
});

export function CurrentChampionshipProvider({
  championship,
  hasExplicitChampionship,
  children,
}: {
  championship: Championship | null;
  hasExplicitChampionship: boolean;
  children: ReactNode;
}) {
  const [currentChampionship, setCurrentChampionship] =
    useState<Championship | null>(championship);

  // Only update if championship was explicitly selected via URL param
  // This preserves selection when navigating to routes without :championshipId
  useEffect(() => {
    if (hasExplicitChampionship && championship) {
      setCurrentChampionship(championship);
    }
  }, [hasExplicitChampionship, championship]);

  return (
    <CurrentChampionshipContext.Provider
      value={{ currentChampionship, setCurrentChampionship }}
    >
      {children}
    </CurrentChampionshipContext.Provider>
  );
}

export function useCurrentChampionship() {
  const context = useContext(CurrentChampionshipContext);
  if (!context) {
    throw new Error(
      "useCurrentChampionship must be used within CurrentChampionshipProvider",
    );
  }
  return context;
}
