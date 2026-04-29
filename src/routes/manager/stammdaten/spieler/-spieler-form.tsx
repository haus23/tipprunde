"use client";

import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";

import { createUserFn, updateUserFn } from "#/app/manager/users.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { Select, SelectItem } from "#/components/(ui)/select.tsx";
import { FieldError, Input, Label, TextField } from "#/components/(ui)/text-field.tsx";
import { useServerAction } from "#/utils/hooks/server-action.ts";
import { slugify } from "#/utils/slugify.ts";
import type { User } from "#db/dal/users.ts";

const ROLES: { value: User["role"]; label: string }[] = [
  { value: "user", label: "Spieler" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

interface Props {
  spieler?: User;
  onSuccess?: (name: string) => void;
}

export function SpielerForm({ spieler, onSuccess }: Props) {
  const serverAction = spieler ? updateUserFn : createUserFn;
  const [state, formAction, pending] = useServerAction(serverAction);
  const router = useRouter();

  const dialog = useContext(OverlayTriggerStateContext);
  const successHandled = useRef(false);
  const [name, setName] = useState(spieler?.name ?? "");
  const [slug, setSlug] = useState(spieler?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state && !successHandled.current) {
      successHandled.current = true;
      void router.invalidate();
      dialog?.close();
      onSuccess?.(name);
    }
  }, [state, dialog]);

  function handleNameBlur() {
    if (!spieler && !slugDirty) setSlug(slugify(name));
  }

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {spieler && <input type="hidden" name="id" value={spieler.id} />}

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
          if (!spieler) setSlugDirty(true);
        }}
        className="flex flex-col gap-1"
      >
        <Label>Kennung (eindeutig)</Label>
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

      <Select label="Rolle" name="role" defaultValue={spieler?.role ?? "user"}>
        {ROLES.map(({ value, label }) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      {state && "error" in state && <p className="text-error text-sm">{state.error}</p>}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {spieler ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
