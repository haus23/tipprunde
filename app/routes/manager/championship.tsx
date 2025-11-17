import { data, useFetcher } from "react-router";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  getChampionshipById,
  getLatestChampionship,
  updateChampionshipFlags,
} from "~/lib/db/championships";
import type { Route } from "./+types/championship";

export async function loader({ params }: Route.LoaderArgs) {
  const championship = params.championshipId
    ? getChampionshipById(params.championshipId)
    : getLatestChampionship();

  if (!championship) {
    throw new Response("Championship not found", { status: 404 });
  }

  return { championship };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const championshipId =
    params.championshipId || String(formData.get("championshipId"));
  const flagName = String(formData.get("flag"));
  const value = formData.get("value") === "true" ? 1 : 0;

  updateChampionshipFlags(championshipId, {
    [flagName]: value,
  });

  return data({ success: true });
}

export default function ChampionshipRoute({
  loaderData,
}: Route.ComponentProps) {
  const { championship } = loaderData;
  const fetcher = useFetcher();

  const handleToggle = (flag: string, isSelected: boolean) => {
    const formData = new FormData();
    formData.set("championshipId", championship.id);
    formData.set("flag", flag);
    formData.set("value", String(isSelected));
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary mb-2">
          {championship.name}
        </h2>
        <p className="text-sm text-secondary">Kennung: {championship.id}</p>
      </div>

      <div className="rounded-lg border border-default bg-raised p-6">
        <h3 className="text-md font-semibold text-primary mb-4">
          Status-Flags
        </h3>
        <div className="flex flex-col gap-4">
          <Switch
            isSelected={!!championship.published}
            onChange={(isSelected) => handleToggle("published", isSelected)}
          >
            <Label>Veröffentlicht</Label>
          </Switch>
          <Switch
            isSelected={!!championship.completed}
            onChange={(isSelected) => handleToggle("completed", isSelected)}
          >
            <Label>Abgeschlossen</Label>
          </Switch>
          <Switch
            isSelected={!!championship.extraPointsPublished}
            onChange={(isSelected) =>
              handleToggle("extraPointsPublished", isSelected)
            }
          >
            <Label>Zusatzpunkte veröffentlicht</Label>
          </Switch>
        </div>
      </div>
    </div>
  );
}
