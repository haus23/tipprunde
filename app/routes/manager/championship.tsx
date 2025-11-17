import { data, useFetcher } from "react-router";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  getChampionshipById,
  getLatestChampionship,
  updateChampionshipFlags,
} from "~/lib/db/championships";
import {
  getChampionshipPlayers,
  getAvailableUsers,
  addPlayerToChampionship,
  removePlayerFromChampionship,
} from "~/lib/db/players";
import type { Route } from "./+types/championship";

export async function loader({ params }: Route.LoaderArgs) {
  const championship = params.championshipId
    ? getChampionshipById(params.championshipId)
    : getLatestChampionship();

  if (!championship) {
    throw new Response("Championship not found", { status: 404 });
  }

  const players = getChampionshipPlayers(championship.id);
  const availableUsers = getAvailableUsers(championship.id);

  return { championship, players, availableUsers };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const championshipId =
    params.championshipId || String(formData.get("championshipId"));
  const intent = String(formData.get("intent"));

  if (intent === "updateFlag") {
    const flagName = String(formData.get("flag"));
    const value = formData.get("value") === "true" ? 1 : 0;

    updateChampionshipFlags(championshipId, {
      [flagName]: value,
    });
  } else if (intent === "addPlayer") {
    const userId = Number(formData.get("userId"));
    addPlayerToChampionship(userId, championshipId);
  } else if (intent === "removePlayer") {
    const userId = Number(formData.get("userId"));
    removePlayerFromChampionship(userId, championshipId);
  }

  return data({ success: true });
}

export default function ChampionshipRoute({
  loaderData,
}: Route.ComponentProps) {
  const { championship, players, availableUsers } = loaderData;
  const fetcher = useFetcher();

  const handleToggle = (flag: string, isSelected: boolean) => {
    const formData = new FormData();
    formData.set("intent", "updateFlag");
    formData.set("championshipId", championship.id);
    formData.set("flag", flag);
    formData.set("value", String(isSelected));
    fetcher.submit(formData, { method: "post" });
  };

  const handleAddPlayer = (userId: number) => {
    const formData = new FormData();
    formData.set("intent", "addPlayer");
    formData.set("championshipId", championship.id);
    formData.set("userId", String(userId));
    fetcher.submit(formData, { method: "post" });
  };

  const handleRemovePlayer = (userId: number) => {
    const formData = new FormData();
    formData.set("intent", "removePlayer");
    formData.set("championshipId", championship.id);
    formData.set("userId", String(userId));
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

      <div className="mt-6 rounded-lg border border-default bg-raised p-6">
        <h3 className="text-md font-semibold text-primary mb-4">Spieler</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Attending Players */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-3">
              Teilnehmer ({players.length})
            </h4>
            <div className="space-y-2">
              {players.length === 0 ? (
                <p className="text-sm text-secondary italic">
                  Keine Spieler hinzugefügt
                </p>
              ) : (
                players.map((player) => (
                  <div
                    key={player.userId}
                    className="flex items-center justify-between p-2 rounded-md bg-default hover:bg-emphasis/5"
                  >
                    <span className="text-sm text-primary">
                      {player.userName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(player.userId)}
                      className="p-1 rounded-md text-secondary hover:text-primary hover:bg-emphasis/10 transition-colors"
                      aria-label={`${player.userName} entfernen`}
                    >
                      <MinusIcon className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Users */}
          <div>
            <h4 className="text-sm font-medium text-secondary mb-3">
              Verfügbare Spieler ({availableUsers.length})
            </h4>
            <div className="space-y-2">
              {availableUsers.length === 0 ? (
                <p className="text-sm text-secondary italic">
                  Alle Spieler wurden hinzugefügt
                </p>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-md bg-default hover:bg-emphasis/5"
                  >
                    <span className="text-sm text-primary">{user.name}</span>
                    <button
                      type="button"
                      onClick={() => handleAddPlayer(user.id)}
                      className="p-1 rounded-md text-secondary hover:text-primary hover:bg-emphasis/10 transition-colors"
                      aria-label={`${user.name} hinzufügen`}
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
