"use client";

import { Link } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { Fragment, useState } from "react";

import { createRoundFn, fetchChampionshipRoundsFn, updateRoundFn } from "#/app/manager/rounds.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Switch } from "#/components/(ui)/switch.tsx";
import type { Round } from "#db/dal/rounds.ts";

interface Props {
  championshipId: number;
  slug: string | undefined;
  initialRounds: Round[];
}

export function RundenManagement({ championshipId, slug, initialRounds }: Props) {
  const [runden, setRunden] = useState(initialRounds);

  async function handleAddRound() {
    await createRoundFn({ data: championshipId });
    setRunden(await fetchChampionshipRoundsFn({ data: championshipId }));
  }

  async function handleChange(
    round: Round,
    field: "published" | "tipsPublished" | "completed" | "isDoubleRound",
    value: boolean,
  ) {
    setRunden((prev) => prev.map((r) => (r.id === round.id ? { ...r, [field]: value } : r)));
    await updateRoundFn({ data: { id: round.id, [field]: value } });
  }

  return (
    <div className="flex flex-col gap-4">
      {runden.length === 0 ? (
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      ) : (
        <div className="grid grid-cols-[1fr_52px_52px_52px_52px_auto] items-center gap-x-1 gap-y-3">
          {/* Header */}
          <div />
          <div className="text-subtle text-center text-[11px] font-medium">Frei</div>
          <div className="text-subtle text-center text-[11px] font-medium">Tipps</div>
          <div className="text-subtle text-center text-[11px] font-medium">Fertig</div>
          <div className="text-subtle text-center text-[11px] font-medium">Doppel</div>
          <div />

          {/* Rows */}
          {runden.map((round) => (
            <Fragment key={round.id}>
              <span className="text-sm">Runde {round.nr}</span>
              <div className="flex justify-center">
                <Switch
                  isSelected={round.published}
                  onChange={(v) => handleChange(round, "published", v)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  isSelected={round.tipsPublished}
                  onChange={(v) => handleChange(round, "tipsPublished", v)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  isSelected={round.completed}
                  onChange={(v) => handleChange(round, "completed", v)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  isSelected={round.isDoubleRound ?? false}
                  onChange={(v) => handleChange(round, "isDoubleRound", v)}
                />
              </div>
              <Link
                to="/manager/{-$slug}/spiele"
                params={slug ? { slug } : {}}
                className="text-subtle hover:text-base flex items-center gap-1.5 text-xs"
              >
                <CalendarIcon size={13} />
                Spiele
              </Link>
            </Fragment>
          ))}
        </div>
      )}
      <Button onPress={handleAddRound}>Neue Runde</Button>
    </div>
  );
}
