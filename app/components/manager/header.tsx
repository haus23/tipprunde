import { useMatches } from "react-router";
import { useChampionship } from "~/lib/manager/use-championship";

export function ManagerHeader() {
  const routeMatch = useMatches().at(-1);
  const championshipTitle = useChampionship()?.name;

  const title = routeMatch?.id.includes("domain")
    ? "Stammdaten"
    : routeMatch?.id.includes("dashboard")
      ? "Hinterhof"
      : championshipTitle;

  return <h1 className="text-xl font-medium">{title}</h1>;
}
