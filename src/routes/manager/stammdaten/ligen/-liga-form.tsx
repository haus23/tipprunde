"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { OverlayTriggerStateContext } from "react-aria-components";

import type { League } from "#db/dal/leagues.ts";
import { createLeagueFn, updateLeagueFn } from "#/app/manager/leagues.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "#/components/(ui)/text-field.tsx";
import { slugify } from "#/utils/slugify.ts";
import { useServerAction } from "#/utils/hooks/server-action.ts";

interface Props {
  liga?: League;
  onSuccess?: (shortName: string) => void;
}

export function LigaForm({ liga, onSuccess }: Props) {
  const serverAction = liga ? updateLeagueFn : createLeagueFn;
  const [state, formAction, pending] = useServerAction(serverAction);
  const router = useRouter();

  const dialog = useContext(OverlayTriggerStateContext);
  const successHandled = useRef(false);
  const [name, setName] = useState(liga?.name ?? "");
  const [shortName, setShortName] = useState(liga?.shortName ?? "");
  const [shortNameDirty, setShortNameDirty] = useState(false);
  const [id, setId] = useState(liga?.id ?? "");
  const [idDirty, setIdDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state && !successHandled.current) {
      successHandled.current = true;
      router.invalidate();
      if (!liga) onSuccess?.(shortName);
      dialog?.close();
    }
  }, [state, dialog]);

  function handleNameBlur() {
    if (!liga && !shortNameDirty) setShortName(name);
  }

  function handleShortNameBlur() {
    if (!liga && !idDirty) setId(slugify(shortName));
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {liga && <input type="hidden" name="id" value={liga.id} />}

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

      {!liga && (
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
          {liga ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
