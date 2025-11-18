import { useEffect } from "react";
import { useFetcher } from "react-router";

import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field-error";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";

type PlayerFormProps = {
  action?: string;
  intent?: string;
  championshipId?: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function PlayerForm({ action = "/hinterhof/stammdaten/spieler/neu", intent, championshipId, onCancel, onSuccess }: PlayerFormProps) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success) {
      onSuccess();
    }
  }, [fetcher.data, onSuccess]);

  return (
    <Form
      method="post"
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        fetcher.submit(e.currentTarget);
      }}
      validationErrors={fetcher.data?.errors}
    >
      {intent && <input type="hidden" name="intent" value={intent} />}
      {championshipId && <input type="hidden" name="championshipId" value={championshipId} />}
      <TextField name="name" isRequired>
        <Label>Name</Label>
        <Input placeholder="z.B. Max Mustermann" className="w-full" />
        <FieldError />
      </TextField>

      <TextField name="slug" isRequired>
        <Label>Slug</Label>
        <Input placeholder="z.B. max-mustermann" className="w-full" />
        <FieldError />
      </TextField>

      <TextField name="email">
        <Label>E-Mail</Label>
        <Input
          type="email"
          placeholder="z.B. max@example.com"
          className="w-full"
        />
        <FieldError />
      </TextField>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary">
          Erstellen
        </Button>
        <Button type="button" variant="secondary" onPress={onCancel}>
          Abbrechen
        </Button>
      </div>
    </Form>
  );
}
