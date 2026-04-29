"use client";

import { useEffect, useState } from "react";

import { ClipboardPasteIcon } from "lucide-react";

import { fetchTipsFn, saveTipFn } from "#/app/manager/tips.ts";
import { Checkbox } from "#/components/(ui)/checkbox.tsx";
import type { Match } from "#db/dal/matches.ts";
import type { Team } from "#db/dal/teams.ts";
import type { Tip } from "#db/dal/tips.ts";

interface Props {
  roundId: number;
  userId: number;
  matches: Match[];
  teams: Team[];
}

type TipState = Record<number, { tip: string; joker: boolean; invalid?: boolean }>;

const TIP_PATTERN = /^\d{1,2}:\d{1,2}$/;

function normalizeTip(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/[-.]/g, ":").replace(/:+/g, ":");
}

function teamShortName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.shortName ?? "—";
}

function teamName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.name ?? "—";
}

export function TippGrid({ roundId, userId, matches, teams }: Props) {
  const [tipState, setTipState] = useState<TipState>({});

  useEffect(() => {
    setTipState({});
    let cancelled = false;
    fetchTipsFn({ data: { roundId, userId } }).then((tips: Tip[]) => {
      if (cancelled) return;
      const state: TipState = {};
      for (const m of matches) {
        const existing = tips.find((t) => t.matchId === m.id);
        state[m.id] = {
          tip: existing?.tip ?? "",
          joker: existing?.joker ?? false,
        };
      }
      setTipState(state);
    });
    return () => {
      cancelled = true;
    };
  }, [roundId, userId]);

  async function applyPastedTips(text: string, startMatchId: number) {
    const rawTips = text.trimEnd().split(/\r?\n/);
    const startIndex = matches.findIndex((m) => m.id === startMatchId);
    const affected = matches.slice(startIndex, startIndex + rawTips.length);

    const updates = affected.map((match, i) => {
      const normalized = normalizeTip(rawTips[i]);
      const invalid = normalized !== "" && !TIP_PATTERN.test(normalized);
      return { matchId: match.id, normalized, invalid };
    });

    setTipState((prev) => {
      const next = { ...prev };
      for (const { matchId, normalized, invalid } of updates) {
        next[matchId] = { ...next[matchId], tip: normalized, invalid };
      }
      return next;
    });

    await Promise.all(
      updates
        .filter((u) => !u.invalid)
        .map((u) =>
          saveTipFn({
            data: {
              matchId: u.matchId,
              userId,
              tip: u.normalized || null,
              joker: tipState[u.matchId]?.joker || null,
            },
          }),
        ),
    );
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, matchId: number) {
    e.preventDefault();
    await applyPastedTips(e.clipboardData.getData("text"), matchId);
  }

  async function handleClipboardButton() {
    const text = await navigator.clipboard.readText();
    if (text && matches[0]) await applyPastedTips(text, matches[0].id);
  }

  async function handleBlur(matchId: number) {
    const { tip, joker } = tipState[matchId] ?? { tip: "", joker: false };
    const normalized = normalizeTip(tip);
    const invalid = normalized !== "" && !TIP_PATTERN.test(normalized);
    setTipState((prev) => ({ ...prev, [matchId]: { ...prev[matchId], tip: normalized, invalid } }));
    if (invalid) return;
    await saveTipFn({
      data: {
        matchId,
        userId,
        tip: normalized || null,
        joker: joker || null,
      },
    });
  }

  return (
    <div className="bg-surface border-surface rounded-md border px-4 py-2">
      <div className="flex justify-end py-1">
        <button
          type="button"
          onClick={handleClipboardButton}
          title="Tipps aus Zwischenablage einfügen"
          className="text-subtle hover:bg-subtle focus-visible:ring-focus rounded-md p-1.5 outline-none focus-visible:ring-2"
        >
          <ClipboardPasteIcon size={16} />
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="text-subtle w-px px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
              #
            </th>
            <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
              Spiel
            </th>
            <th className="text-subtle w-px px-1 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
              Tipp
            </th>
            <th className="text-subtle w-px px-1 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
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
                  <span className="md:hidden">
                    {teamShortName(teams, match.hometeamId)} –{" "}
                    {teamShortName(teams, match.awayteamId)}
                  </span>
                  <span className="hidden md:inline">
                    {teamName(teams, match.hometeamId)} – {teamName(teams, match.awayteamId)}
                  </span>
                </td>
                <td className="px-1 py-1.5 text-center">
                  <input
                    type="text"
                    value={tipState[match.id]?.tip ?? ""}
                    onChange={(e) =>
                      setTipState((prev) => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], tip: e.target.value, invalid: false },
                      }))
                    }
                    onPaste={(e) => handlePaste(e, match.id)}
                    onBlur={() => handleBlur(match.id)}
                    aria-invalid={tipState[match.id]?.invalid}
                    className="border-input focus-visible:ring-focus aria-invalid:border-error aria-invalid:text-error w-12 rounded-md border bg-transparent px-2 py-1 text-center text-sm outline-none focus-visible:ring-2"
                  />
                </td>
                <td className="w-px px-1 py-2">
                  <div className="flex justify-center">
                    <Checkbox
                      isSelected={tipState[match.id]?.joker ?? false}
                      onChange={(checked) => {
                        setTipState((prev) => ({
                          ...prev,
                          [match.id]: { ...prev[match.id], joker: checked },
                        }));
                        saveTipFn({
                          data: {
                            matchId: match.id,
                            userId,
                            tip: tipState[match.id]?.tip || null,
                            joker: checked || null,
                          },
                        });
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
