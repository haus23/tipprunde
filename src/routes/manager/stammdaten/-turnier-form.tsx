import { useContext, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { Select, SelectItem } from "@/components/(ui)/select.tsx";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { createTurnier } from "@/lib/championships.ts";
import type { rulesets } from "@/lib/db/schema.ts";

interface Props {
  regelwerke: typeof rulesets.$inferSelect[];
  nextNr: number;
}

function deriveSlug(name: string): string {
  const match = name.match(/^([HRWE]).*(\d{2})\/?(\d{2})$/i);
  if (!match) return "";
  const first = match[1].toLowerCase();
  const second = "HR".includes(match[1].toUpperCase()) ? "r" : "m";
  return first + second + match[2] + match[3];
}

export function TurnierForm({ regelwerke, nextNr }: Props) {
  const [state, formAction, pending] = useServerAction(createTurnier);

  const router = useRouter();
  const dialog = useContext(OverlayTriggerStateContext);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state) {
      router.invalidate();
      dialog?.close();
    }
  }, [state, router, dialog]);

  function handleNameBlur() {
    if (!slugDirty) {
      const derived = deriveSlug(name);
      if (derived) setSlug(derived);
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setSlugDirty(true);
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
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
        onChange={handleSlugChange}
        className="flex flex-col gap-1"
      >
        <Label>Kürzel</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField
        name="nr"
        isRequired
        defaultValue={String(nextNr)}
        className="flex flex-col gap-1"
      >
        <Label>Nummer</Label>
        <Input type="number" />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <Select label="Regelwerk" name="rulesetId" defaultValue={regelwerke[0]?.id}>
        {regelwerke.map((r) => (
          <SelectItem key={r.id} id={r.id}>
            {r.name}
          </SelectItem>
        ))}
      </Select>

      {state && "error" in state && (
        <p className="text-error text-sm">{state.error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          Anlegen
        </Button>
      </div>
    </Form>
  );
}
