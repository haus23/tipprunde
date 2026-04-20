import { Link } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import type { Round } from "#db/dal/rounds.ts";
import { Button } from "@/components/(ui)/button.tsx";
import { Switch } from "@/components/(ui)/switch.tsx";
import { createRound, fetchChampionshipRounds, setRoundStatus } from "@/lib/rounds.ts";

interface Props {
  championshipId: number;
  slug: string;
  initialRounds: Round[];
}

export function RundenManagement({ championshipId, slug, initialRounds }: Props) {
  const [runden, setRunden] = useState(initialRounds);

  async function handleAddRound() {
    await createRound({ data: championshipId });
    setRunden(await fetchChampionshipRounds({ data: championshipId }));
  }

  async function handlePublishedChange(round: Round, value: boolean) {
    setRunden((prev) => prev.map((r) => (r.id === round.id ? { ...r, published: value } : r)));
    await setRoundStatus({ data: { roundId: round.id, published: value } });
  }

  return (
    <div className="flex flex-col gap-3">
      {runden.length === 0 ? (
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      ) : (
        runden.map((round) => (
          <div key={round.id} className="flex items-center justify-between gap-4">
            <Switch isSelected={round.published} onChange={(v) => handlePublishedChange(round, v)}>
              <span className="text-sm">Runde {round.nr}</span>
            </Switch>
            <Link
              to="/manager/$slug/spiele"
              params={{ slug }}
              search={{ nr: round.nr }}
              className="text-subtle flex items-center gap-1.5 text-xs hover:text-base"
            >
              <CalendarIcon size={13} />
              Spiele
            </Link>
          </div>
        ))
      )}
      <div className="mt-1">
        <Button onPress={handleAddRound}>Neue Runde</Button>
      </div>
    </div>
  );
}
