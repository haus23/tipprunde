import { createContext, use, useEffect } from "react";
import type { Championship } from "../model/championship";
import { useState } from "react";
import { useParams } from "react-router";

const ChampionshipContext = createContext<Championship | null>(null);

export function ChampionshipProvider({
  loaderChampionship,
  children,
}: {
  loaderChampionship: Championship | null;
  children: React.ReactNode;
}) {
  const params = useParams();

  const [championship, setChampionship] = useState<Championship | null>(
    loaderChampionship,
  );

  useEffect(() => {
    if (
      championship &&
      params.championshipId &&
      championship.id !== params.championshipId
    ) {
      setChampionship(loaderChampionship);
    }
  }, [championship, loaderChampionship, params.championshipId]);

  return (
    <ChampionshipContext value={championship}>{children}</ChampionshipContext>
  );
}

export function useChampionship() {
  return use(ChampionshipContext);
}
