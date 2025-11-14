import { redirect } from "react-router";
import { Form } from "react-router";
import { Button, TextField, Label, Input } from "react-aria-components";
import { createChampionship } from "~/lib/db/championships";
import type { Route } from "./+types/create";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id")).trim();
  const name = String(formData.get("name")).trim();
  const nr = Number(formData.get("nr"));

  // For now, always use original rules
  const ruleId = "original-rules";

  createChampionship(id, name, nr, ruleId);

  throw redirect("/hinterhof");
}

export default function NewChampionship() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Neues Tippturnier</h1>

      <Form method="post" className="max-w-md space-y-4">
        <TextField isRequired>
          <Label>ID</Label>
          <Input
            name="id"
            placeholder="z.B. hr2526"
            className="w-full px-3 py-2 border rounded"
          />
        </TextField>

        <TextField isRequired>
          <Label>Name</Label>
          <Input
            name="name"
            placeholder="z.B. Hinrunde 2025/26"
            className="w-full px-3 py-2 border rounded"
          />
        </TextField>

        <TextField isRequired>
          <Label>Nummer</Label>
          <Input
            name="nr"
            type="number"
            placeholder="z.B. 58"
            className="w-full px-3 py-2 border rounded"
          />
        </TextField>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Erstellen
          </Button>
          <Button
            type="button"
            className="px-4 py-2 border rounded"
            onPress={() => window.history.back()}
          >
            Abbrechen
          </Button>
        </div>
      </Form>
    </div>
  );
}
