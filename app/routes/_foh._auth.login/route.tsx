import { data, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";

import type { Route } from "./+types/route";
import { db } from "~/utils/db.server";
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return data(
      { errors: { email: "Unbekannte Email-Adresse. Wende dich an Micha." } },
      { status: 400 },
    );
  }

  return redirect("/verify");
}

export default function LoginRoute() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;

  return (
    <div className="p-2 flex flex-col gap-4">
      <title>Anmeldung - runde.tips</title>
      <meta name="description" content="Anmeldung bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Anmeldung</h1>
      <div>
        <fetcher.Form method="post" className="flex flex-col gap-2">
          <TextField>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" required />
            {errors?.email ? <em className="text-sm">{errors.email}</em> : null}
          </TextField>
          <div>
            <Button type="submit">Code anfordern</Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
