"use client";

import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";

import { createRulesetFn, updateRulesetFn } from "#/app/manager/rulesets.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { Select, SelectItem } from "#/components/(ui)/select.tsx";
import { FieldError, Input, Label, TextArea, TextField } from "#/components/(ui)/text-field.tsx";
import {
  EXTRA_QUESTION_RULES,
  JOKER_RULES,
  MATCH_RULES,
  ROUND_RULES,
  TIP_RULES,
} from "#/domain/rules.ts";
import { useServerAction } from "#/utils/hooks/server-action.ts";
import { slugify } from "#/utils/slugify.ts";
import type { Ruleset } from "#db/dal/rulesets.ts";

interface Props {
  regelwerk?: Ruleset;
}

export function RegelwerkForm({ regelwerk }: Props) {
  const serverAction = regelwerk ? updateRulesetFn : createRulesetFn;
  const [state, formAction, pending] = useServerAction(serverAction);
  const router = useRouter();

  const dialog = useContext(OverlayTriggerStateContext);
  const successHandled = useRef(false);
  const [name, setName] = useState(regelwerk?.name ?? "");
  const [id, setId] = useState(regelwerk?.id ?? "");
  const [idDirty, setIdDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state && !successHandled.current) {
      successHandled.current = true;
      void router.invalidate();
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
          onChange={(v) => {
            setId(v);
            setIdDirty(true);
          }}
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

      {state && "error" in state && <p className="text-error text-sm">{state.error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {regelwerk ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
