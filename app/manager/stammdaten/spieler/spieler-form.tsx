"use client";

import { useContext, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button";
import { Form } from "@/components/(ui)/form";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field";
import { Select, SelectItem } from "@/components/(ui)/select";
import { createSpieler, updateSpieler, type SpielerFormState } from "./actions";
import type { users } from "@/lib/db/schema";

type Spieler = typeof users.$inferSelect;

const ROLES: { value: Spieler["role"]; label: string }[] = [
  { value: "user", label: "Spieler" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface Props {
  spieler?: Spieler;
}

export function SpielerForm({ spieler }: Props) {
  const action = spieler ? updateSpieler : createSpieler;
  const [state, formAction, pending] = useActionState<SpielerFormState, FormData>(
    action,
    null,
  );

  const router = useRouter();
  const dialog = useContext(OverlayTriggerStateContext);

  const [name, setName] = useState(spieler?.name ?? "");
  const [slug, setSlug] = useState(spieler?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state) {
      router.refresh();
      dialog?.close();
    }
  }, [state, router, dialog]);

  function handleNameChange(value: string) {
    setName(value);
    if (!spieler && !slugDirty) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    if (!spieler) setSlugDirty(true);
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {spieler && <input type="hidden" name="id" value={spieler.id} />}

      <TextField
        name="name"
        isRequired
        value={name}
        onChange={handleNameChange}
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
        type="email"
        name="email"
        defaultValue={spieler?.email ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>E-Mail</Label>
        <Input />
        <FieldError>Bitte eine gültige E-Mail-Adresse eingeben.</FieldError>
      </TextField>

      <Select label="Rolle" name="role" defaultSelectedKey={spieler?.role ?? "user"}>
        {ROLES.map(({ value, label }) => (
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
          {spieler ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
