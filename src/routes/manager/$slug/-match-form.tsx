import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { ComboBox } from "@/components/(ui)/combobox.tsx";
import { DatePicker } from "@/components/(ui)/date-picker.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { createMatchFn, updateMatchFn } from "@/lib/matches.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { leagues, matches, teams } from "@/lib/db/schema.ts";

type League = typeof leagues.$inferSelect;
type Team = typeof teams.$inferSelect;
type Match = typeof matches.$inferSelect & {
  league: League | null;
  hometeam: Team | null;
  awayteam: Team | null;
};

interface Props {
  match?: Match;
  roundId: number;
  leagues: League[];
  teams: Team[];
}

export function MatchForm({ match, roundId, leagues, teams }: Props) {
  const dialog = useContext(OverlayTriggerStateContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState<string | null>(match?.date ?? null);
  const [leagueId, setLeagueId] = useState<string | null>(match?.leagueId ?? null);
  const [hometeamId, setHometeamId] = useState<string | null>(match?.hometeamId ?? null);
  const [awayteamId, setAwayteamId] = useState<string | null>(match?.awayteamId ?? null);
  const [result, setResult] = useState(match?.result ?? "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (match) {
        await updateMatchFn({
          data: {
            id: match.id,
            date,
            leagueId,
            hometeamId,
            awayteamId,
            result: result || null,
          },
        });
      } else {
        await createMatchFn({
          data: { roundId, date, leagueId, hometeamId, awayteamId, result: result || null },
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.byRound(roundId) });
      dialog?.close();
    } catch {
      setError("Spiel konnte nicht gespeichert werden.");
      setPending(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DatePicker label="Datum" value={date} onChange={setDate} />

      <ComboBox
        label="Liga"
        items={leagues}
        selectedKey={leagueId}
        onSelectionChange={(key) => setLeagueId(key as string | null)}
        placeholder="Liga wählen …"
      />

      <ComboBox
        label="Heimteam"
        items={teams}
        selectedKey={hometeamId}
        onSelectionChange={(key) => setHometeamId(key as string | null)}
        placeholder="Team wählen …"
      />

      <ComboBox
        label="Auswärtsteam"
        items={teams}
        selectedKey={awayteamId}
        onSelectionChange={(key) => setAwayteamId(key as string | null)}
        placeholder="Team wählen …"
      />

      <TextField
        value={result}
        onChange={setResult}
        className="flex flex-col gap-1"
      >
        <Label>Ergebnis</Label>
        <Input placeholder="z.B. 2:1" />
      </TextField>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {match ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
