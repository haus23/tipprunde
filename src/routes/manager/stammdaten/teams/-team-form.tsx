"use client";

import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";

import { createTeamFn, updateTeamFn } from "#/app/manager/teams.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "#/components/(ui)/text-field.tsx";
import { useServerAction } from "#/utils/hooks/server-action.ts";
import { slugify } from "#/utils/slugify.ts";
import type { Team } from "#db/dal/teams.ts";

interface Props {
  team?: Team;
  onSuccess?: (shortName: string) => void;
}

export function TeamForm({ team, onSuccess }: Props) {
  const serverAction = team ? updateTeamFn : createTeamFn;
  const [state, formAction, pending] = useServerAction(serverAction);
  const router = useRouter();

  const dialog = useContext(OverlayTriggerStateContext);
  const successHandled = useRef(false);
  const [name, setName] = useState(team?.name ?? "");
  const [shortName, setShortName] = useState(team?.shortName ?? "");
  const [shortNameDirty, setShortNameDirty] = useState(false);
  const [id, setId] = useState(team?.id ?? "");
  const [idDirty, setIdDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state && !successHandled.current) {
      successHandled.current = true;
      router.invalidate();
      if (!team) onSuccess?.(shortName);
      dialog?.close();
    }
  }, [state, dialog]);

  function handleNameBlur() {
    if (!team && !shortNameDirty) setShortName(name);
  }

  function handleShortNameBlur() {
    if (!team && !idDirty) setId(slugify(shortName));
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {team && <input type="hidden" name="id" value={team.id} />}

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

      <TextField
        name="shortName"
        isRequired
        value={shortName}
        onChange={(v) => {
          setShortName(v);
          setShortNameDirty(true);
        }}
        onBlur={handleShortNameBlur}
        className="flex flex-col gap-1"
      >
        <Label>Kurzname</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      {!team && (
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

      {state && "error" in state && <p className="text-error text-sm">{state.error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {team ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
