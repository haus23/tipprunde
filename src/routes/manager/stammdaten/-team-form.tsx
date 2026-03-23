import { useContext, useEffect } from "react";
import { OverlayTriggerStateContext } from "react-aria-components";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { createTeamFn, updateTeamFn } from "@/lib/teams.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { teams } from "@/lib/db/schema.ts";

type Team = typeof teams.$inferSelect;

interface Props {
  team?: Team;
}

export function TeamForm({ team }: Props) {
  const serverAction = team ? updateTeamFn : createTeamFn;
  const [state, formAction, pending] = useServerAction(serverAction);

  const dialog = useContext(OverlayTriggerStateContext);

  useEffect(() => {
    if (state && "success" in state) {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
      dialog?.close();
    }
  }, [state, dialog]);

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      {team && <input type="hidden" name="id" value={team.id} />}

      {!team && (
        <TextField name="id" isRequired className="flex flex-col gap-1">
          <Label>Kennung (eindeutig)</Label>
          <Input />
          <FieldError>Pflichtfeld.</FieldError>
        </TextField>
      )}

      <TextField
        name="name"
        isRequired
        defaultValue={team?.name ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>Name</Label>
        <Input />
        <FieldError>Pflichtfeld.</FieldError>
      </TextField>

      <TextField
        name="shortName"
        isRequired
        defaultValue={team?.shortName ?? ""}
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
          {team ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
}
