import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/(ui)/switch.tsx";
import { fetchTurnierDetails, setTurnierStatus } from "@/lib/championships.ts";
import { fetchPlayers } from "@/lib/players.ts";
import { fetchTurnierSpieler } from "@/lib/participants.ts";
import { SpielerManagement } from "./-spieler-management.tsx";

export const Route = createFileRoute("/manager/$slug/turnier")({
  beforeLoad: () => ({ pageTitle: "Turnier" }),
  loader: async ({ params }) => {
    const championship = await fetchTurnierDetails({ data: params.slug });
    if (!championship) return { championship: null, tournamentPlayers: [], allUsers: [] };
    const [tournamentPlayers, allUsers] = await Promise.all([
      fetchTurnierSpieler({ data: championship.id }),
      fetchPlayers(),
    ]);
    return { championship, tournamentPlayers, allUsers };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Turnier | ${loaderData?.championship?.name}` }],
  }),
  component: TurnierPage,
});

function TurnierPage() {
  const { championship, tournamentPlayers, allUsers } = Route.useLoaderData();

  const hasExtraQuestions =
    championship?.ruleset?.extraQuestionRuleId === "mit-zusatzfragen";

  const [published, setPublished] = useState(championship?.published ?? false);
  const [extraQuestionsPublished, setExtraQuestionsPublished] = useState(
    championship?.extraQuestionsPublished ?? false,
  );
  const [completed, setCompleted] = useState(championship?.completed ?? false);

  if (!championship) return null;

  async function handleChange(
    field: "published" | "extraQuestionsPublished" | "completed",
    value: boolean,
  ) {
    await setTurnierStatus({ data: { slug: championship!.slug, field, value } });
    if (field === "published") setPublished(value);
    if (field === "extraQuestionsPublished") setExtraQuestionsPublished(value);
    if (field === "completed") {
      setCompleted(value);
      if (value) setExtraQuestionsPublished(true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface border-surface rounded-md border p-6">
        <h2 className="text-sm font-medium">Status</h2>
        <div className="mt-4 flex flex-col gap-4">
          <Switch
            isSelected={published}
            onChange={(v) => handleChange("published", v)}
          >
            <div>
              <div className="text-sm font-medium">Veröffentlicht</div>
              <div className="text-subtle text-xs">Turnier ist für Teilnehmer sichtbar</div>
            </div>
          </Switch>

          {hasExtraQuestions && (
            <Switch
              isSelected={extraQuestionsPublished}
              isDisabled={!published}
              onChange={(v) => handleChange("extraQuestionsPublished", v)}
            >
              <div>
                <div className="text-sm font-medium">Zusatzpunkte veröffentlicht</div>
                <div className="text-subtle text-xs">Zusatzfragen sind freigeschaltet</div>
              </div>
            </Switch>
          )}

          <Switch
            isSelected={completed}
            isDisabled={!published}
            onChange={(v) => handleChange("completed", v)}
          >
            <div>
              <div className="text-sm font-medium">Abgeschlossen</div>
              <div className="text-subtle text-xs">
                Turnier ist beendet, keine Tipps mehr möglich
              </div>
            </div>
          </Switch>
        </div>
      </div>

      <div className="bg-surface border-surface rounded-md border p-6">
        <h2 className="text-sm font-medium">Spieler</h2>
        <div className="mt-4">
          <SpielerManagement
            championshipId={championship.id}
            initialPlayers={tournamentPlayers}
            initialUsers={allUsers}
          />
        </div>
      </div>
    </div>
  );
}
