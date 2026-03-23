import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/(ui)/button.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchMatchesForRound } from "@/lib/matches.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { leagues, matches, teams } from "@/lib/db/schema.ts";
import { MatchForm } from "./-match-form.tsx";

type League = typeof leagues.$inferSelect;
type Team = typeof teams.$inferSelect;
type Match = typeof matches.$inferSelect & {
  league: League | null;
  hometeam: Team | null;
  awayteam: Team | null;
};

interface Props {
  roundId: number;
  leagues: League[];
  teams: Team[];
}

export function MatchesTable({ roundId, leagues, teams }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Match | undefined>(undefined);

  const { data: matchList = [] } = useQuery({
    queryKey: queryKeys.matches.byRound(roundId),
    queryFn: () => fetchMatchesForRound({ data: roundId }),
  });

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(m: Match) {
    setEditTarget(m);
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {matchList.length > 0 && (
          <div className="mb-1 grid grid-cols-[2rem_7rem_5rem_1fr_2rem_1fr_5rem_2rem] gap-2 px-2 text-xs font-medium text-subtle">
            <span className="text-right">#</span>
            <span>Datum</span>
            <span>Liga</span>
            <span>Heim</span>
            <span />
            <span>Auswärts</span>
            <span className="text-center">Erg.</span>
            <span />
          </div>
        )}
        {matchList.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[2rem_7rem_5rem_1fr_2rem_1fr_5rem_2rem] items-center gap-2 rounded px-2 py-1 text-sm hover:bg-subtle/50"
          >
            <span className="text-right text-subtle">{m.nr}.</span>
            <span className="text-subtle">{m.date ?? "—"}</span>
            <span className="truncate text-subtle">{m.league?.shortName ?? "—"}</span>
            <span className="truncate">{m.hometeam?.shortName ?? "—"}</span>
            <span className="text-center text-subtle">vs</span>
            <span className="truncate">{m.awayteam?.shortName ?? "—"}</span>
            <span className="text-center">{m.result ?? "—"}</span>
            <Button
              variant="secondary"
              size="icon"
              onPress={() => openEdit(m as Match)}
              aria-label="Spiel bearbeiten"
            >
              <PencilIcon size={13} />
            </Button>
          </div>
        ))}
        <div className="mt-2">
          <Button onPress={openCreate}>Neues Spiel</Button>
        </div>
      </div>

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Spiel bearbeiten" : "Neues Spiel"}
      >
        <MatchForm
          key={editTarget?.id ?? "new"}
          match={editTarget}
          roundId={roundId}
          leagues={leagues}
          teams={teams}
        />
      </Dialog>
    </>
  );
}
