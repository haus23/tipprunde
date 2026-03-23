import { useContext, useEffect, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextArea, TextField } from "@/components/(ui)/text-field.tsx";
import { Select, SelectItem } from "@/components/(ui)/select.tsx";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { createRegelwerk, updateRegelwerk } from "@/lib/rulesets.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import { slugify } from "@/lib/slugify.ts";
import type { rulesets } from "@/lib/db/schema.ts";

type Regelwerk = typeof rulesets.$inferSelect;

const TIP_RULES: { value: string; label: string }[] = [
  { value: "drei-zwei-oder-ein-punkt-joker-verdoppelt", label: "3, 2 oder 1 Punkt, Joker verdoppelt" },
  { value: "drei-oder-ein-punkt-joker-verdoppelt", label: "3 oder 1 Punkt, Joker verdoppelt" },
];

const JOKER_RULES: { value: string; label: string }[] = [
  { value: "einmal-pro-runde", label: "Genau einmal pro Runde" },
  { value: "zwei-pro-turnier", label: "Genau zwei im gesamten Turnier" },
];

const MATCH_RULES: { value: string; label: string }[] = [
  { value: "keine-besonderheiten", label: "Keine Besonderheiten" },
  { value: "alleiniger-treffer-drei-punkte", label: "Alleiniger Treffer: 3 Punkte extra" },
];

const ROUND_RULES: { value: string; label: string }[] = [
  { value: "keine-besonderheiten", label: "Keine Besonderheiten" },
  { value: "alles-verdoppelt", label: "Alles verdoppelt" },
];

const EXTRA_QUESTION_RULES: { value: string; label: string }[] = [
  { value: "mit-zusatzfragen", label: "Mit Zusatzfragen" },
  { value: "keine-zusatzfragen", label: "Keine Zusatzfragen" },
];

interface Props {
  regelwerk?: Regelwerk;
}

export function RegelwerkForm({ regelwerk }: Props) {
  const serverAction = regelwerk ? updateRegelwerk : createRegelwerk;
  const [state, formAction, pending] = useServerAction(serverAction);

  const dialog = useContext(OverlayTriggerStateContext);
  const [name, setName] = useState(regelwerk?.name ?? "");
  const [id, setId] = useState(regelwerk?.id ?? "");
  const [idDirty, setIdDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state) {
      queryClient.invalidateQueries({ queryKey: queryKeys.rulesets.all });
      dialog?.close();
    }
  }, [state, dialog]);

  function handleNameBlur() {
    if (!regelwerk && !idDirty) setId(slugify(name));
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {regelwerk && <input type="hidden" name="id" value={regelwerk.id} />}

      <TextField
        name="name"
        isRequired
        value={name}
        onChange={setName}
        onBlur={handleNameBlur}
        className="flex flex-col gap-1"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      {!regelwerk && (
        <TextField
          name="id"
          isRequired
          value={id}
          onChange={(v) => { setId(v); setIdDirty(true); }}
          className="flex flex-col gap-1"
        >
          <Label>Kennung (eindeutig)</Label>
          <Input />
          <FieldError>Pflichtfeld.</FieldError>
        </TextField>
      )}

      <TextField
        name="description"
        isRequired
        defaultValue={regelwerk?.description ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>Beschreibung</Label>
        <TextArea rows={4} />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <Select
        label="Tipp-Regel"
        name="tipRuleId"
        defaultValue={regelwerk?.tipRuleId ?? "drei-zwei-oder-ein-punkt-joker-verdoppelt"}
      >
        {TIP_RULES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Joker-Regel"
        name="jokerRuleId"
        defaultValue={regelwerk?.jokerRuleId ?? "einmal-pro-runde"}
      >
        {JOKER_RULES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Spiel-Regel"
        name="matchRuleId"
        defaultValue={regelwerk?.matchRuleId ?? "keine-besonderheiten"}
      >
        {MATCH_RULES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Runden-Regel"
        name="roundRuleId"
        defaultValue={regelwerk?.roundRuleId ?? "keine-besonderheiten"}
      >
        {ROUND_RULES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Zusatzfragen-Regel"
        name="extraQuestionRuleId"
        defaultValue={regelwerk?.extraQuestionRuleId ?? "mit-zusatzfragen"}
      >
        {EXTRA_QUESTION_RULES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      {state && "error" in state && (
        <p className="text-error text-sm">{state.error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {regelwerk ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
