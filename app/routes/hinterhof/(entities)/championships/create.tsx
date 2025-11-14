import { redirect } from "react-router";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TextField } from "~/components/ui/text-field";
import { Label } from "~/components/ui/label";
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
    <div>
      <h1 className="text-2xl font-medium mb-6 text-primary">
        Neues Tippturnier
      </h1>

      <Form method="post" className="flex flex-col gap-4">
        <TextField isRequired>
          <Label>ID</Label>
          <Input name="id" placeholder="z.B. hr2526" className="w-full" />
        </TextField>

        <TextField isRequired>
          <Label>Name</Label>
          <Input
            name="name"
            placeholder="z.B. Hinrunde 2025/26"
            className="w-full"
          />
        </TextField>

        <TextField isRequired>
          <Label>Nummer</Label>
          <Input
            name="nr"
            type="number"
            placeholder="z.B. 58"
            className="w-full"
          />
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
