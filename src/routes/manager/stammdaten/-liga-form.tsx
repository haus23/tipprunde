import { useContext, useEffect } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { createLiga, updateLiga } from "@/lib/leagues.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { leagues } from "@/lib/db/schema.ts";

type Liga = typeof leagues.$inferSelect;

interface Props {
  liga?: Liga;
}

export function LigaForm({ liga }: Props) {
  const serverAction = liga ? updateLiga : createLiga;
  const [state, formAction, pending] = useServerAction(serverAction);

  const dialog = useContext(OverlayTriggerStateContext);

  useEffect(() => {
    if (state && "success" in state) {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
      dialog?.close();
    }
  }, [state, dialog]);

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {liga && <input type="hidden" name="id" value={liga.id} />}

      {!liga && (
        <TextField name="id" isRequired className="flex flex-col gap-1">
          <Label>ID (Slug)</Label>
          <Input />
          <FieldError>Pflichtfeld.</FieldError>
        </TextField>
      )}

      <TextField
        name="name"
        isRequired
        defaultValue={liga?.name ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField
        name="shortName"
        isRequired
        defaultValue={liga?.shortName ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>Kurzname</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

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
