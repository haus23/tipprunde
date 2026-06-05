import { championships } from "@tipprunde/db/schema";
import { eq } from "drizzle-orm";
import { SwitchButton, SwitchField } from "react-aria-components";
import { useFetcher } from "react-router";
import * as v from "valibot";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/index";

export const handle = { title: "Übersicht" };

const flagField = v.picklist(["published", "completed", "extraQuestionsPublished"]);
type FlagField = v.InferOutput<typeof flagField>;

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const ruleset = await db.query.rulesets.findFirst({
    where: { id: championship.rulesetId },
    columns: { extraQuestionRuleId: true },
  });
  return {
    championship,
    hasExtraQuestions: ruleset?.extraQuestionRuleId === "mit-zusatzfragen",
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const field = v.parse(flagField, formData.get("field"));
  const value = formData.get("value") === "true";
  await db
    .update(championships)
    .set({ [field]: value })
    .where(eq(championships.id, championship.id));
  return null;
}

type FlagSwitchProps = {
  label: string;
  description: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
  isPending?: boolean;
};

function FlagSwitch({ label, description, isSelected, onChange, isPending }: FlagSwitchProps) {
  return (
    <SwitchField
      isSelected={isSelected}
      onChange={onChange}
      isDisabled={isPending}
      className="py-3"
    >
      <SwitchButton
        className={cn(
          "flex cursor-pointer items-center gap-4",
          "data-focus-visible:rounded-sm data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-accent",
        )}
      >
        {({ isSelected, isDisabled }) => (
          <>
            <div
              className={cn(
                "flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
                isSelected ? "border-accent bg-btn" : "border-subtle bg-surface",
                isDisabled && "opacity-50",
              )}
            >
              <div
                className={cn(
                  "ml-0.5 size-4 rounded-full transition-transform",
                  isSelected ? "translate-x-4 bg-white" : "bg-control",
                )}
              />
            </div>
            <div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-subtle text-xs">{description}</div>
            </div>
          </>
        )}
      </SwitchButton>
    </SwitchField>
  );
}

export default function ChampionshipIndex({ loaderData }: Route.ComponentProps) {
  const { championship, hasExtraQuestions } = loaderData;
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";

  const pendingField = fetcher.formData?.get("field") as FlagField | undefined;
  const pendingValue = fetcher.formData?.get("value") === "true";

  function getFlag(field: FlagField, serverValue: boolean) {
    return pendingField === field ? pendingValue : serverValue;
  }

  function toggleFlag(field: FlagField, current: boolean) {
    void fetcher.submit({ field, value: String(!current) }, { method: "post" });
  }

  const published = getFlag("published", championship.published);
  const completed = getFlag("completed", championship.completed);
  const extraQuestionsPublished = getFlag(
    "extraQuestionsPublished",
    championship.extraQuestionsPublished,
  );

  return (
    <div className="p-8">
      <title>{`Übersicht | ${championship.name}`}</title>
      <Card>
        <div className="border-subtle border-b px-6 py-4">
          <h2 className="text-sm font-semibold">Turnier-Status</h2>
        </div>
        <CardContent>
          <div className="divide-subtle divide-y">
            <FlagSwitch
              label="Veröffentlicht"
              description="Turnier ist auf dem Frontend sichtbar"
              isSelected={published}
              onChange={() => toggleFlag("published", published)}
              isPending={isPending}
            />
            <FlagSwitch
              label="Abgeschlossen"
              description="Turnier ist beendet; löst abschließende Neuberechnung aus"
              isSelected={completed}
              onChange={() => toggleFlag("completed", completed)}
              isPending={isPending}
            />
            {hasExtraQuestions && (
              <FlagSwitch
                label="Zusatzfragen veröffentlicht"
                description="Zusatzfragen und Antworten sind auf dem Frontend sichtbar"
                isSelected={extraQuestionsPublished}
                onChange={() => toggleFlag("extraQuestionsPublished", extraQuestionsPublished)}
                isPending={isPending}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
