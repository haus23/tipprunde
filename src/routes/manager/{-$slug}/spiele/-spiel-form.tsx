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
  leagues: League[];
  teams: Team[];
  onSaved: (matches: Match[]) => void;
  onCancel: () => void;
}

export function SpielForm({ roundId, editMatch, leagues, teams, onSaved, onCancel }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(editMatch?.date ?? "");
  const [leagueId, setLeagueId] = useState<string | null>(editMatch?.leagueId ?? null);
  const [hometeamId, setHometeamId] = useState<string | null>(editMatch?.hometeamId ?? null);
  const [awayteamId, setAwayteamId] = useState<string | null>(editMatch?.awayteamId ?? null);

  const prevEditMatch = useRef(editMatch);
  useEffect(() => {
    if (prevEditMatch.current?.id !== editMatch?.id) {
      prevEditMatch.current = editMatch;
      setDate(editMatch?.date ?? "");
      setLeagueId(editMatch?.leagueId ?? null);
      setHometeamId(editMatch?.hometeamId ?? null);
      setAwayteamId(editMatch?.awayteamId ?? null);
      setError(null);
    }
  }, [editMatch]);

  function reset() {
    setDate("");
    setLeagueId(null);
    setHometeamId(null);
    setAwayteamId(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (editMatch) {
        await updateMatchFn({
          data: { id: editMatch.id, date: date || null, leagueId, hometeamId, awayteamId, result: editMatch.result },
        });
      } else {
        await createMatchFn({
          data: { roundId, date: date || null, leagueId, hometeamId, awayteamId, result: null },
        });
      }
      const updated = await fetchMatchesForRoundFn({ data: roundId });
      onSaved(updated);
      reset();
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
        <div className="flex flex-col gap-1">
          <Label>Datum</Label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-input data-hovered:border-input-hovered focus-visible:ring-focus w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
          />
        </div>

        <ComboBox
          label="Liga"
          items={leagueItems}
          selectedKey={leagueId}
          onSelectionChange={(key) => setLeagueId(key as string | null)}
          placeholder="Liga wählen …"
        />

        <ComboBox
          label="Heimteam"
          items={teamItems}
          selectedKey={hometeamId}
          onSelectionChange={(key) => setHometeamId(key as string | null)}
          placeholder="Team wählen …"
        />

        <ComboBox
          label="Auswärtsteam"
          items={teamItems}
          selectedKey={awayteamId}
          onSelectionChange={(key) => setAwayteamId(key as string | null)}
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
