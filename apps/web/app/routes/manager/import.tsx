import { Button, Card, CardContent, FieldError, Label, TextArea } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
import { ChevronDownIcon } from "lucide-react";
import {
  Button as RACButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { data, useFetcher } from "react-router";
import * as v from "valibot";

import { getChampionshipBySlug, getOpenChampionships } from "#/lib/championship.server.ts";
import { userContext } from "#/lib/context.ts";
import { importLegacyData, importSchema, type ImportSummary } from "#/lib/import.server.ts";
import { isAdmin } from "#/lib/session.server.ts";

import type { Route } from "./+types/import";

export const handle = { title: "Import" };

// Championship-agnostic on purpose: the JSON shape (`import.server.ts`) still
// mirrors the legacy MySQL dump, but the source will not stay that way — the
// running runde.tips prod DB and the organiser's spreadsheet are both queued
// up as later sources (see project_legacy_import.md, outside the repo). What
// every source has in common is that it has to become this JSON; only the
// picker here needs to know which championship it lands in.

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
  const championships = await getOpenChampionships();
  return { championships };
}

export async function action({ request, context }: Route.ActionArgs) {
  if (!isAdmin(context.get(userContext))) {
    throw data("Nur für Admins.", { status: 403 });
  }
  const formData = await request.formData();

  const slug = String(formData.get("championshipSlug") ?? "");
  const championship = await getChampionshipBySlug(slug);
  if (!championship) {
    return { errors: { championshipSlug: ["Bitte ein Turnier wählen."] } };
  }

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

export default function Import({ loaderData }: Route.ComponentProps) {
  const { championships } = loaderData;
  const fetcher = useFetcher<{
    errors?: Record<string, string[]>;
    summary?: ImportSummary;
  }>();
  const isPending = fetcher.state !== "idle";
  const errors = fetcher.data?.errors;
  const summary = fetcher.data?.summary;

  const selectClass = cx(
    "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
    "outline-none data-focused:ring-2 data-focused:ring-accent/60",
  );

  return (
    <div>
      <title>Import</title>
      <Card>
        <CardContent>
          {championships.length === 0 ? (
            <p className="text-subtle text-sm">
              Kein offenes Turnier — ein abgeschlossenes Turnier wird nicht mehr importiert. Lege es
              unter Stammdaten → Turniere an.
            </p>
          ) : (
            <fetcher.Form method="post" className="flex flex-col gap-4">
              {/* Capped, unlike the JSON field below: a Select this wide would
                  stretch across a large desktop for no reason — there is
                  nothing to read in it, only one name to pick. */}
              <Select
                name="championshipSlug"
                isRequired
                isInvalid={!!errors?.championshipSlug?.length}
                defaultSelectedKey={championships[0].slug}
                className="flex max-w-sm flex-col gap-1.5"
              >
                <Label>Turnier</Label>
                <RACButton
                  className={cx(selectClass, "flex w-full items-center justify-between gap-2")}
                >
                  <SelectValue className="text-sm" />
                  <ChevronDownIcon className="text-muted size-4 shrink-0" />
                </RACButton>
                <FieldError>{errors?.championshipSlug?.[0]}</FieldError>
                <Popover className="bg-surface-raised border-subtle w-[--trigger-width] rounded-sm border shadow-lg outline-none">
                  <ListBox className="p-1">
                    {championships.map((championship) => (
                      <ListBoxItem
                        key={championship.slug}
                        id={championship.slug}
                        className={cx(
                          "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
                          "hover:bg-nav-active",
                          "data-focused:bg-nav-active",
                          "data-selected:bg-accent-subtle",
                        )}
                      >
                        {championship.name}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>

              <TextField
                name="json"
                isRequired
                isInvalid={!!errors?.json?.length}
                className="flex flex-col gap-1.5"
              >
                <Label>Import-JSON</Label>
                <TextArea rows={16} className="font-mono text-xs" />
                <FieldError>{errors?.json?.[0]}</FieldError>
              </TextField>

              <Button type="submit" isDisabled={isPending} className="self-start">
                {isPending ? "Importiere…" : "Import starten"}
              </Button>
            </fetcher.Form>
          )}

          {errors?.json && errors.json.length > 1 && (
            <ul className="text-error mt-4 list-disc pl-5 text-sm">
              {errors.json.map((e) => (
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
  );
}
