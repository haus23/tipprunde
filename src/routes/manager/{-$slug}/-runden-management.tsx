"use client";

import { Link, useRouter } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Focusable, Tooltip, TooltipTrigger } from "react-aria-components";

import { createRoundFn, fetchChampionshipRoundsFn, updateRoundFn } from "#/app/manager/rounds.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Switch } from "#/components/(ui)/switch.tsx";
import type { Round } from "#db/dal/rounds.ts";

const tooltipClass =
  "rounded-sm bg-inverted px-2 py-1 text-inverted text-sm data-[entering]:animate-[tooltip-enter_120ms_ease-out_backwards] data-[exiting]:animate-[tooltip-exit_100ms_ease-in_forwards]";

interface Props {
  championshipId: number;
  slug: string | undefined;
  initialRounds: Round[];
}

export function RundenManagement({ championshipId, slug, initialRounds }: Props) {
  const [runden, setRunden] = useState(initialRounds);
  const router = useRouter();

  async function handleAddRound() {
    await createRoundFn({ data: championshipId });
    setRunden(await fetchChampionshipRoundsFn({ data: championshipId }));
    router.invalidate();
  }

  async function handleChange(
    round: Round,
    field: "published" | "tipsPublished" | "completed",
    value: boolean,
  ) {
    setRunden((prev) => prev.map((r) => (r.id === round.id ? { ...r, [field]: value } : r)));
    await updateRoundFn({ data: { id: round.id, [field]: value } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h2 className="text-sm font-medium">Runden</h2>
        <div className="ml-auto">
          <Button onPress={handleAddRound}>Neue Runde</Button>
        </div>
      </div>

      <div className="bg-surface border-surface rounded-md border px-4 py-2">
        <table className="w-full [border-spacing:0] text-sm">
          <thead>
            <tr className="border-input border-b text-left">
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-xs font-medium uppercase tracking-wide">
                #
              </th>
              {(["Frei", "Tipps", "Fertig"] as const).map((label, i) => (
                <th
                  key={label}
                  className="text-subtle w-px px-4 pt-2 pb-3 text-center text-xs font-medium uppercase tracking-wide"
                >
                  <TooltipTrigger delay={500}>
                    <Focusable>
                      <span className="cursor-default underline decoration-dotted underline-offset-2">
                        {label}
                      </span>
                    </Focusable>
                    <Tooltip placement="top" offset={6} className={tooltipClass}>
                      {
                        [
                          "Runde mit Spielen ist veröffentlicht",
                          "Tipps aller Spieler sind öffentlich",
                          "Runde ist abgeschlossen und berechnet",
                        ][i]
                      }
                    </Tooltip>
                  </TooltipTrigger>
                </th>
              ))}
              <th />
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium uppercase tracking-wide">
                Spiele
              </th>
            </tr>
          </thead>
          <tbody>
            {runden.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-subtle px-2 py-6 text-center">
                  Noch keine Runden angelegt.
                </td>
              </tr>
            ) : (
              runden.map((round) => (
                <tr key={round.id} className="border-input border-b last:border-b-0">
                  <td className="w-px px-2 py-2">{round.nr}</td>
                  <td className="w-px px-4 py-2 text-center">
                    <Switch
                      isSelected={round.published}
                      onChange={(v) => handleChange(round, "published", v)}
                    />
                  </td>
                  <td className="w-px px-4 py-2 text-center">
                    <Switch
                      isSelected={round.tipsPublished}
                      isDisabled={!round.published}
                      onChange={(v) => handleChange(round, "tipsPublished", v)}
                    />
                  </td>
                  <td className="w-px px-4 py-2 text-center">
                    <Switch
                      isSelected={round.completed}
                      isDisabled={!round.tipsPublished}
                      onChange={(v) => handleChange(round, "completed", v)}
                    />
                  </td>
                  <td />
                  <td className="w-px px-2 py-2 text-center">
                    <Link
                      to="/manager/{-$slug}/spiele"
                      params={slug ? { slug } : {}}
                      className="text-subtle hover:bg-subtle inline-flex rounded-md p-1.5"
                    >
                      <CalendarIcon size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
