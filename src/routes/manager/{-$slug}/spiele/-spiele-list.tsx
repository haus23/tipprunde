"use client";

import { PencilIcon } from "lucide-react";

import { Button } from "#/components/(ui)/button.tsx";
import type { League } from "#db/dal/leagues.ts";
import type { Match } from "#db/dal/matches.ts";
import type { Team } from "#db/dal/teams.ts";

interface Props {
  matches: Match[];
  leagues: League[];
  teams: Team[];
  onEdit: (match: Match) => void;
}

export function SpieleList({ matches, leagues, teams, onEdit }: Props) {
  function leagueName(id: string | null) {
    return leagues.find((l) => l.id === id)?.name ?? "—";
  }

  function teamName(id: string | null) {
    return teams.find((t) => t.id === id)?.name ?? "—";
  }

  return (
    <div className="bg-surface border-surface rounded-md border px-4 py-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="text-subtle w-px px-2 pt-2 pb-3 text-xs font-medium uppercase tracking-wide">
              #
            </th>
            <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium uppercase tracking-wide">
              Datum
            </th>
            <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium uppercase tracking-wide">
              Spiel
            </th>
            <th className="text-subtle hidden px-2 pt-2 pb-3 text-xs font-medium uppercase tracking-wide sm:table-cell">
              Liga
            </th>
            <th className="w-px" />
          </tr>
        </thead>
        <tbody>
          {matches.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-subtle px-2 py-6 text-center">
                Noch keine Spiele in dieser Runde.
              </td>
            </tr>
          ) : (
            matches.map((match) => (
              <tr key={match.id} className="border-input border-b last:border-b-0">
                <td className="w-px px-2 py-2">{match.nr}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {match.date
                    ? new Date(match.date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-2 py-2">
                  {teamName(match.hometeamId)} – {teamName(match.awayteamId)}
                </td>
                <td className="hidden px-2 py-2 sm:table-cell">{leagueName(match.leagueId)}</td>
                <td className="w-px px-2 py-2 text-right">
                  <Button
                    variant="secondary"
                    size="icon"
                    onPress={() => onEdit(match)}
                    aria-label="Bearbeiten"
                  >
                    <PencilIcon size={14} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
