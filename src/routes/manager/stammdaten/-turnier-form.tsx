import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { rulesets } from "#db/schema/tables.ts";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { Select, SelectItem } from "@/components/(ui)/select.tsx";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { activateChampionship, createTurnier } from "@/lib/championships.ts";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";

interface Props {
  regelwerke: (typeof rulesets.$inferSelect)[];
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

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state) {
      const slug = state.slug;
      queryClient.invalidateQueries({ queryKey: queryKeys.turniere.all });
      activateChampionship({ data: slug }).then(() => {
        router.navigate({ to: "/manager/$slug/turnier", params: { slug } });
      });
    }
  }, [state, router]);

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
        <Label>Kennung (eindeutig)</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField name="nr" isRequired defaultValue={String(nextNr)} className="flex flex-col gap-1">
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

      {state && "error" in state && <p className="text-error text-sm">{state.error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          Anlegen
        </Button>
      </div>
    </Form>
  );
}
