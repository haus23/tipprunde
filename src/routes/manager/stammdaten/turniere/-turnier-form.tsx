"use client";

import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";

import {
  createChampionshipFn,
  updateChampionshipDetailsFn,
} from "#/app/manager/championships.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { Select, SelectItem } from "#/components/(ui)/select.tsx";
import { FieldError, Input, Label, TextField } from "#/components/(ui)/text-field.tsx";
import { useServerAction } from "#/utils/hooks/server-action.ts";
import type { Championship } from "#db/dal/championships.ts";
import type { Ruleset } from "#db/dal/rulesets.ts";

function deriveSlug(name: string): string {
  const match = name.match(/^([HRWE]).*(\d{2})\/?(\d{2})$/i);
  if (!match) return "";
  const first = match[1].toLowerCase();
  const second = "HR".includes(match[1].toUpperCase()) ? "r" : "m";
  return first + second + match[2] + match[3];
}

interface Props {
  regelwerke: Ruleset[];
  nextNr?: number;
  turnier?: Championship;
}

export function TurnierForm({ regelwerke, nextNr, turnier }: Props) {
  const serverAction = turnier ? updateChampionshipDetailsFn : createChampionshipFn;
  const [state, formAction, pending] = useServerAction(serverAction);
  const router = useRouter();
  const dialog = useContext(OverlayTriggerStateContext);

  const successHandled = useRef(false);
  const [name, setName] = useState(turnier?.name ?? "");
  const [slug, setSlug] = useState(turnier?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state && !successHandled.current) {
      successHandled.current = true;
      if (turnier) {
        router.invalidate();
        dialog?.close();
      } else if ("slug" in state && typeof state.slug === "string") {
        const { slug } = state;
        router.navigate({ to: "/manager/{-$slug}", params: { slug } }).then(() => {
          router.invalidate();
        });
      }
    }
  }, [state, router, dialog, turnier]);

  function handleNameBlur() {
    if (!turnier && !slugDirty) {
      const derived = deriveSlug(name);
      if (derived) setSlug(derived);
    }
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {turnier && <input type="hidden" name="id" value={turnier.id} />}

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
        name="slug"
        isRequired
        value={slug}
        onChange={(v) => {
          setSlug(v);
          if (!turnier) setSlugDirty(true);
        }}
        className="flex flex-col gap-1"
      >
        <Label>Kennung (eindeutig)</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField
        name="nr"
        isRequired
        defaultValue={String(turnier?.nr ?? nextNr)}
        className="flex flex-col gap-1"
      >
        <Label>Nummer</Label>
        <Input type="number" />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <Select
        label="Regelwerk"
        name="rulesetId"
        defaultValue={turnier?.rulesetId ?? regelwerke[0]?.id}
      >
        {regelwerke.map((r) => (
          <SelectItem key={r.id} id={r.id}>
            {r.name}
          </SelectItem>
        ))}
      </Select>

      {state && "error" in state && <p className="text-error text-sm">{state.error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {turnier ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
