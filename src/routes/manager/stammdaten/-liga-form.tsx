import { useContext, useEffect, useState } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { createLiga, updateLiga } from "@/lib/leagues.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import { slugify } from "@/lib/slugify.ts";
import type { leagues } from "#db/schema/tables.ts";

type Liga = typeof leagues.$inferSelect;

interface Props {
  liga?: Liga;
}

export function LigaForm({ liga }: Props) {
  const serverAction = liga ? updateLiga : createLiga;
  const [state, formAction, pending] = useServerAction(serverAction);

  const dialog = useContext(OverlayTriggerStateContext);
  const [name, setName] = useState(liga?.name ?? "");
  const [shortName, setShortName] = useState(liga?.shortName ?? "");
  const [shortNameDirty, setShortNameDirty] = useState(false);
  const [id, setId] = useState(liga?.id ?? "");
  const [idDirty, setIdDirty] = useState(false);

  useEffect(() => {
    if (state && "success" in state) {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
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
        onChange={(v) => { setShortName(v); setShortNameDirty(true); }}
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
          onChange={(v) => { setId(v); setIdDirty(true); }}
          className="flex flex-col gap-1"
        >
          <Label>Kennung (eindeutig)</Label>
          <Input />
          <FieldError>Pflichtfeld.</FieldError>
        </TextField>
      )}

      {state && "error" in state && (
        <p className="text-error text-sm">{state.error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" isDisabled={pending}>
          {liga ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
