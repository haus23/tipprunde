"use client";

import { useEffect, useState } from "react";

import { fetchTipsFn, saveTipFn } from "#/app/manager/tips.ts";
import type { Tip } from "#db/dal/tips.ts";
import type { Match } from "#db/dal/matches.ts";
import type { Team } from "#db/dal/teams.ts";

interface Props {
  roundId: number;
  userId: number;
  matches: Match[];
  teams: Team[];
}

type TipState = Record<number, { tip: string; joker: boolean }>;

function teamName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.name ?? "—";
}

export function TippGrid({ roundId, userId, matches, teams }: Props) {
  const [tipState, setTipState] = useState<TipState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTipsFn({ data: { roundId, userId } }).then((tips: Tip[]) => {
      const state: TipState = {};
      for (const m of matches) {
        const existing = tips.find((t) => t.matchId === m.id);
        state[m.id] = {
          tip: existing?.tip ?? "",
          joker: existing?.joker ?? false,
        };
      }
      setTipState(state);
      setLoading(false);
    });
  }, [roundId, userId]);

  async function handleBlur(matchId: number) {
    const { tip, joker } = tipState[matchId] ?? { tip: "", joker: false };
    await saveTipFn({
      data: {
        matchId,
        userId,
        tip: tip || null,
        joker: joker || null,
      },
    });
  }

  if (loading) {
    return <p className="text-subtle text-sm">Lade Tipps …</p>;
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
              Spiel
            </th>
            <th className="text-subtle w-28 px-2 pt-2 pb-3 text-center text-xs font-medium uppercase tracking-wide">
              Tipp
            </th>
            <th className="text-subtle w-px px-2 pt-2 pb-3 text-center text-xs font-medium uppercase tracking-wide">
              Joker
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-subtle px-2 py-6 text-center">
                Noch keine Spiele in dieser Runde.
              </td>
            </tr>
          ) : (
            matches.map((match) => (
              <tr key={match.id} className="border-input border-b last:border-b-0">
                <td className="w-px px-2 py-2">{match.nr}</td>
                <td className="px-2 py-2">
                  {teamName(teams, match.hometeamId)} – {teamName(teams, match.awayteamId)}
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input
                    type="text"
                    value={tipState[match.id]?.tip ?? ""}
                    onChange={(e) =>
                      setTipState((prev) => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], tip: e.target.value },
                      }))
                    }
                    onBlur={() => handleBlur(match.id)}
                    className="border-input focus-visible:ring-focus w-full rounded-md border bg-transparent px-2 py-1 text-center text-sm outline-none focus-visible:ring-2"
                  />
                </td>
                <td className="w-px px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={tipState[match.id]?.joker ?? false}
                    onChange={(e) => {
                      setTipState((prev) => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], joker: e.target.checked },
                      }));
                      saveTipFn({
                        data: {
                          matchId: match.id,
                          userId,
                          tip: tipState[match.id]?.tip || null,
                          joker: e.target.checked || null,
                        },
                      });
                    }}
                    className="accent-btn size-4 cursor-pointer"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
