"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/(ui)/button";
import { Form } from "@/components/(ui)/form";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field";
import { createSpieler, updateSpieler, type SpielerFormState } from "./actions";
import type { users } from "@/lib/db/schema";

type Spieler = typeof users.$inferSelect;

const ROLES: Spieler["role"][] = ["anon", "user", "manager", "admin"];

interface Props {
  spieler?: Spieler;
  onSuccess: () => void;
}

export function SpielerForm({ spieler, onSuccess }: Props) {
  const action = spieler ? updateSpieler : createSpieler;
  const [state, formAction, pending] = useActionState<SpielerFormState, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state && "success" in state) onSuccess();
  }, [state, onSuccess]);

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {spieler && <input type="hidden" name="id" value={spieler.id} />}

      <TextField
        name="name"
        isRequired
        defaultValue={spieler?.name}
        className="flex flex-col gap-1"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField
        name="slug"
        isRequired
        defaultValue={spieler?.slug}
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

      <div className="flex flex-col gap-1">
        <label className="text-subtle text-sm" htmlFor="spieler-role">
          Rolle
        </label>
        <select
          id="spieler-role"
          name="role"
          defaultValue={spieler?.role ?? "user"}
          className="border-input rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

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
