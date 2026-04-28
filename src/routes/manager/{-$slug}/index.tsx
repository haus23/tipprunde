import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { fetchCurrentChampionshipFn, updateChampionshipFn } from "#/app/manager/championships.ts";
import { fetchPlayersFn } from "#/app/manager/players.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { fetchUsersFn } from "#/app/manager/users.ts";
import { Switch } from "#/components/(ui)/switch.tsx";

import { RundenManagement } from "./-runden-management.tsx";
import { SpielerManagement } from "./-spieler-management.tsx";

export const Route = createFileRoute("/manager/{-$slug}/")({
  beforeLoad: () => ({ pageTitle: "Turnier" }),
  loader: async ({ context: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    const [rounds, players, allUsers] = championship
      ? await Promise.all([
          fetchChampionshipRoundsFn({ data: championship.id }),
          fetchPlayersFn({ data: championship.id }),
          fetchUsersFn(),
        ])
      : [[], [], []];
    return { championship, rounds, players, allUsers };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Turnier | ${loaderData?.championship?.name}` }],
  }),
  component: TurnierPage,
});

function TurnierPage() {
  const { championship, rounds, players, allUsers } = Route.useLoaderData();

  const hasExtraQuestions = championship?.ruleset?.extraQuestionRuleId === "mit-zusatzfragen";

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
    const updates: Record<string, boolean> = { [field]: value };
    if (field === "completed" && value && hasExtraQuestions) {
      updates.extraQuestionsPublished = true;
    }
    await updateChampionshipFn({ data: { id: championship!.id, ...updates } });
    if (field === "published") setPublished(value);
    if (field === "extraQuestionsPublished") setExtraQuestionsPublished(value);
    if (field === "completed") {
      setCompleted(value);
      if (value && hasExtraQuestions) setExtraQuestionsPublished(true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Turnier</h1>
      <div className="bg-surface border-surface rounded-md border p-6">
        <h2 className="text-sm font-medium">Status</h2>
        <div className="mt-4 flex flex-col gap-4">
          <Switch isSelected={published} onChange={(v) => handleChange("published", v)}>
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
                <div className="text-subtle text-xs">Punkte sind berücksichtigt</div>
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
              <div className="text-subtle text-xs">Turnier ist beendet</div>
            </div>
          </Switch>
        </div>
      </div>

      <RundenManagement
        championshipId={championship.id}
        slug={championship.slug}
        initialRounds={rounds}
      />

      <div className="bg-surface border-surface rounded-md border p-6">
        <h2 className="text-sm font-medium">Spieler</h2>
        <div className="mt-4">
          <SpielerManagement
            championshipId={championship.id}
            initialPlayers={players}
            initialUsers={allUsers}
          />
        </div>
      </div>
    </div>
  );
}
