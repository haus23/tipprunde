import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { OtpInput } from "~/components/ui/otp-input";
import { TextField } from "~/components/ui/text-field";
import { verifyOnboardingCode } from "~/utils/auth.server";

import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  return await verifyOnboardingCode(request);
}

export default function VerifyRoute() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;

  return (
    <div className="p-2 flex flex-col gap-4">
      <title>Einlass - runde.tips</title>
      <meta name="description" content="Einlass bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Einlass</h1>
      <div>
        <fetcher.Form
          method="post"
          className="flex flex-col items-center gap-4"
        >
          <TextField className="items-center">
            <Label htmlFor="code">Code</Label>
            <OtpInput maxLength={6} name="code" id="code" autoFocus />
            {errors?.code ? <em className="text-sm">{errors.code}</em> : null}
          </TextField>
          <div>
            <Button type="submit">Code prüfen</Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
