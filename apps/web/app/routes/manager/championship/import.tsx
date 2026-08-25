import { Button, Card, CardContent, FieldError, Label, TextArea } from "@tipprunde/ui";
import { TextField } from "react-aria-components";
import { data, useFetcher } from "react-router";
import * as v from "valibot";

import { championshipContext, userContext } from "#/lib/context.ts";
import { importLegacyData, importSchema, type ImportSummary } from "#/lib/import.server.ts";
import { isAdmin } from "#/lib/session.server.ts";

import type { Route } from "./+types/import";

export const handle = { title: "Legacy-Import" };

// Temporary tool for the historical-data import — see project_legacy_import.md
// (outside the repo). Removed once the last tournament from the dump lands.

function issueMessages(issues: readonly v.BaseIssue<unknown>[]): string[] {
  return issues.map((issue) => {
    const path = issue.path?.map((p) => String(p.key)).join(".");
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  if (!isAdmin(context.get(userContext))) {
    throw data("Nur für Admins.", { status: 403 });
  }
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  if (!isAdmin(context.get(userContext))) {
    throw data("Nur für Admins.", { status: 403 });
  }
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const raw = String(formData.get("json") ?? "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { errors: { json: ["Kein gültiges JSON."] } };
  }

  const result = v.safeParse(importSchema, parsed);
  if (!result.success) {
    return { errors: { json: issueMessages(result.issues) } };
  }

  try {
    const summary = await importLegacyData(championship, result.output);
    return { summary };
  } catch (err) {
    return { errors: { json: [err instanceof Error ? err.message : "Unbekannter Fehler."] } };
  }
}

export default function Import() {
  const fetcher = useFetcher<{ errors?: { json: string[] }; summary?: ImportSummary }>();
  const isPending = fetcher.state !== "idle";
  const errors = fetcher.data?.errors?.json;
  const summary = fetcher.data?.summary;

  return (
    <div className="p-8">
      <title>Legacy-Import</title>
      <div className="max-w-2xl">
        <Card>
          <CardContent>
            <fetcher.Form method="post" className="flex flex-col gap-4">
              <TextField name="json" isRequired className="flex flex-col gap-1.5">
                <Label>Import-JSON</Label>
                <TextArea rows={16} className="font-mono text-xs" />
                <FieldError>{errors?.[0]}</FieldError>
              </TextField>
              <Button type="submit" isDisabled={isPending} className="self-start">
                {isPending ? "Importiere…" : "Import starten"}
              </Button>
            </fetcher.Form>

            {errors && errors.length > 1 && (
              <ul className="text-error mt-4 list-disc pl-5 text-sm">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}

            {summary && (
              <p className="text-accent mt-4 text-sm">
                {summary.teams} Teams · {summary.leagues} Ligen · {summary.players} Spieler ·{" "}
                {summary.matches} Spiele · {summary.tips} Tipps importiert.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
