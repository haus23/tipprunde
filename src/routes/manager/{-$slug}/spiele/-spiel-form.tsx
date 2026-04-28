"use client";

import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { createMatchFn, fetchMatchesForRoundFn, updateMatchFn } from "#/app/manager/matches.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { ComboBox } from "#/components/(ui)/combobox.tsx";
import { Label } from "#/components/(ui)/text-field.tsx";
import type { League } from "#db/dal/leagues.ts";
import type { Match } from "#db/dal/matches.ts";
import type { Team } from "#db/dal/teams.ts";

interface Props {
  roundId: number;
  editMatch: Match | null;
  defaultDate?: string;
  leagues: League[];
  teams: Team[];
  onSaved: (matches: Match[]) => void;
  onCancel: () => void;
}

export function SpielForm({
  roundId,
  editMatch,
  defaultDate,
  leagues,
  teams,
  onSaved,
  onCancel,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(editMatch?.date ?? defaultDate ?? "");
  const [leagueId, setLeagueId] = useState<string | null>(editMatch?.leagueId ?? null);
  const [hometeamId, setHometeamId] = useState<string | null>(editMatch?.hometeamId ?? null);
  const [awayteamId, setAwayteamId] = useState<string | null>(editMatch?.awayteamId ?? null);

  const defaultDateRef = useRef(defaultDate);
  defaultDateRef.current = defaultDate;

  useEffect(() => {
    if (!editMatch) setDate(defaultDateRef.current ?? "");
  }, [defaultDate]);

  const prevEditMatch = useRef(editMatch);
  useEffect(() => {
    if (prevEditMatch.current?.id !== editMatch?.id) {
      prevEditMatch.current = editMatch;
      setDate(editMatch?.date ?? defaultDateRef.current ?? "");
      setLeagueId(editMatch?.leagueId ?? null);
      setHometeamId(editMatch?.hometeamId ?? null);
      setAwayteamId(editMatch?.awayteamId ?? null);
      setError(null);
    }
  }, [editMatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (editMatch) {
        await updateMatchFn({
          data: {
            id: editMatch.id,
            date: date || null,
            leagueId,
            hometeamId,
            awayteamId,
            result: editMatch.result,
          },
        });
      } else {
        await createMatchFn({
          data: { roundId, date: date || null, leagueId, hometeamId, awayteamId, result: null },
        });
      }
      const updated = await fetchMatchesForRoundFn({ data: roundId });
      onSaved(updated);
      setDate(updated.findLast((m) => m.date)?.date ?? defaultDate ?? "");
      setLeagueId(null);
      setHometeamId(null);
      setAwayteamId(null);
      router.invalidate();
    } catch {
      setError("Spiel konnte nicht gespeichert werden.");
    } finally {
      setPending(false);
    }
  }

  const leagueItems = leagues.map((l) => ({ id: l.id, name: l.name }));
  const teamItems = teams.map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="bg-surface border-surface rounded-md border p-6">
      <h2 className="mb-4 text-sm font-medium">
        {editMatch ? "Spiel bearbeiten" : "Spiel anlegen"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <Label>Datum</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-input data-hovered:border-input-hovered focus-visible:ring-focus rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
            />
          </div>

          <div className="flex-1">
            <ComboBox
              label="Liga"
              items={leagueItems}
              value={leagueId}
              onChange={(key) => setLeagueId(key as string | null)}
              placeholder="Liga wählen …"
            />
          </div>
        </div>

        <ComboBox
          label="Heimteam"
          items={teamItems}
          value={hometeamId}
          onChange={(key) => setHometeamId(key as string | null)}
          placeholder="Team wählen …"
        />

        <ComboBox
          label="Auswärtsteam"
          items={teamItems}
          value={awayteamId}
          onChange={(key) => setAwayteamId(key as string | null)}
          placeholder="Team wählen …"
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          {editMatch && (
            <Button variant="secondary" onPress={onCancel}>
              Abbrechen
            </Button>
          )}
          <Button type="submit" isDisabled={pending}>
            {editMatch ? "Speichern" : "Anlegen"}
          </Button>
        </div>
      </form>
    </div>
  );
}
