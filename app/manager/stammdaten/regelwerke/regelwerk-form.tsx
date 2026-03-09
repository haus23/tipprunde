"use client";

import { useContext, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button";
import { Form } from "@/components/(ui)/form";
import { FieldError, Input, Label, TextArea, TextField } from "@/components/(ui)/text-field";
import { Select, SelectItem } from "@/components/(ui)/select";
import {
  createRegelwerk,
  updateRegelwerk,
  type RegelwerkFormState,
} from "./actions";
import type { rulesets } from "@/lib/db/schema";

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
  const action = regelwerk ? updateRegelwerk : createRegelwerk;
  const [state, formAction, pending] = useActionState<RegelwerkFormState, FormData>(
    action,
    null,
  );

  const router = useRouter();
  const dialog = useContext(OverlayTriggerStateContext);

  useEffect(() => {
    if (state && "success" in state) {
      router.refresh();
      dialog?.close();
    }
  }, [state, router, dialog]);

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={regelwerk?.id ?? ""} />

      {!regelwerk && (
        <TextField name="id" isRequired className="flex flex-col gap-1">
          <Label>ID (Slug)</Label>
          <Input />
          <FieldError>Pflichtfeld.</FieldError>
        </TextField>
      )}

      <TextField
        name="name"
        isRequired
        defaultValue={regelwerk?.name ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

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
