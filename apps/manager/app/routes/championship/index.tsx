import { Card, CardContent } from "../../components/card";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/index";

export function loader({ context }: Route.LoaderArgs) {
  return { championship: context.get(championshipContext) };
}

export default function ChampionshipIndex({ loaderData }: Route.ComponentProps) {
  const { championship } = loaderData;
  return (
    <div className="p-8">
      <title>{`Übersicht | ${championship?.name}`}</title>
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold">{championship?.name}</h1>
        </CardContent>
      </Card>
    </div>
  );
}
