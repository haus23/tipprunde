import { useEffect } from "react";
import { useFetcher } from "react-router";

import { Button } from "~/components/ui/button";
import { FieldError } from "~/components/ui/field-error";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";

type LeagueFormProps = {
  action?: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function LeagueForm({
  action = "/hinterhof/stammdaten/ligen/neu",
  onCancel,
  onSuccess,
}: LeagueFormProps) {
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
      <TextField name="id" isRequired>
        <Label>Kennung</Label>
        <Input placeholder="z.B. bl" className="w-full" />
        <FieldError />
      </TextField>

      <TextField name="name" isRequired>
        <Label>Name</Label>
        <Input placeholder="z.B. Bundesliga" className="w-full" />
        <FieldError />
      </TextField>

      <TextField name="shortname">
        <Label>Kurzname</Label>
        <Input placeholder="z.B. BL" className="w-full" />
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
