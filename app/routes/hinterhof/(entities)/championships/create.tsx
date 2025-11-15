import { data, redirect, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TextField } from "~/components/ui/text-field";
import { Label } from "~/components/ui/label";
import { Form } from "~/components/ui/form";
import { FieldError } from "~/components/ui/field-error";
import { createChampionship } from "~/lib/db/championships";
import type { Route } from "./+types/create";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id")).trim();
  const name = String(formData.get("name")).trim();
  const nr = Number(formData.get("nr"));

  // Validation
  const errors: Record<string, string> = {};

  if (!id) {
    errors.id = "Kennung ist erforderlich";
  }
  if (!name) {
    errors.name = "Name ist erforderlich";
  }
  if (!nr || nr < 1) {
    errors.nr = "Nummer muss mindestens 1 sein";
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  // For now, always use original rules
  const ruleId = "original-rules";

  createChampionship(id, name, nr, ruleId);

  throw redirect("/hinterhof");
}

export default function NewChampionship({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6 text-primary">
        Neues Tippturnier
      </h1>

      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          submit(e.currentTarget);
        }}
        validationErrors={actionData?.errors}
      >
        <TextField name="id" isRequired>
          <Label>Kennung</Label>
          <Input placeholder="z.B. hr2526" className="w-full" />
          <FieldError />
        </TextField>

        <TextField name="name" isRequired>
          <Label>Name</Label>
          <Input placeholder="z.B. Hinrunde 2025/26" className="w-full" />
          <FieldError />
        </TextField>

        <TextField name="nr" type="number" isRequired>
          <Label>Nummer</Label>
          <Input placeholder="z.B. 58" className="w-full" />
          <FieldError />
        </TextField>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary">
            Erstellen
          </Button>
          <Button
            type="button"
            variant="secondary"
            onPress={() => window.history.back()}
          >
            Abbrechen
          </Button>
        </div>
      </Form>
    </div>
  );
}
