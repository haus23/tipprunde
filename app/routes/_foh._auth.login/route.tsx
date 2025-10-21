import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";

import type { Route } from "./+types/route";
import { prepareOnboarding } from "~/utils/auth.server";

export async function action({ request }: Route.ActionArgs) {
  return await prepareOnboarding(request);
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
