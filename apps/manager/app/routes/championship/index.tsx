import { championships, rounds as roundsTable } from "@tipprunde/db/schema";
import { eq, max } from "drizzle-orm";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button, SwitchButton, SwitchField } from "react-aria-components";
import { Link, useFetcher } from "react-router";
import * as v from "valibot";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { RundeDialog } from "../../components/runde-dialog";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/index";

export const handle = { title: "Übersicht" };

const flagField = v.picklist(["published", "completed", "extraQuestionsPublished"]);
type FlagField = v.InferOutput<typeof flagField>;

const roundFlagField = v.picklist(["published", "tipsPublished"]);
type RoundFlagField = v.InferOutput<typeof roundFlagField>;

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const [ruleset, roundList] = await Promise.all([
    db.query.rulesets.findFirst({
      where: { id: championship.rulesetId },
      columns: { extraQuestionRuleId: true },
    }),
    db.query.rounds.findMany({
      where: { championshipId: championship.id },
      columns: { id: true, nr: true, published: true, tipsPublished: true },
      orderBy: { nr: "asc" },
    }),
  ]);
  return {
    championship,
    hasExtraQuestions: ruleset?.extraQuestionRuleId === "mit-zusatzfragen",
    roundList,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-round") {
    const result = await db
      .select({ maxNr: max(roundsTable.nr) })
      .from(roundsTable)
      .where(eq(roundsTable.championshipId, championship.id));
    const nextNr = (result[0]?.maxNr ?? 0) + 1;
    await db.insert(roundsTable).values({ championshipId: championship.id, nr: nextNr });
    return null;
  }

  if (intent === "toggle-round-flag") {
    const roundId = Number(formData.get("roundId"));
    const field = v.parse(roundFlagField, formData.get("field"));
    const value = formData.get("value") === "true";
    await db
      .update(roundsTable)
      .set({ [field]: value })
      .where(eq(roundsTable.id, roundId));
    return null;
  }

  // Championship flag toggle
  const field = v.parse(flagField, formData.get("field"));
  const value = formData.get("value") === "true";
  await db
    .update(championships)
    .set({ [field]: value })
    .where(eq(championships.id, championship.id));
  return null;
}

// --- Championship flag switches ---

type FlagSwitchProps = {
  label: string;
  description: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
  isDisabled?: boolean;
};

function FlagSwitch({ label, description, isSelected, onChange, isDisabled }: FlagSwitchProps) {
  return (
    <SwitchField
      isSelected={isSelected}
      onChange={onChange}
      isDisabled={isDisabled}
      className="py-3"
    >
      <SwitchButton
        className={cn(
          "flex items-center gap-4",
          "data-disabled:opacity-50",
          "data-focus-visible:rounded-sm data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-accent",
        )}
      >
        {({ isSelected }) => (
          <>
            <div
              className={cn(
                "flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
                isSelected ? "border-accent bg-btn" : "border-subtle bg-surface",
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

// --- Compact round flag switches ---

type CompactSwitchProps = {
  label: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
  isDisabled?: boolean;
};

function CompactSwitch({ label, isSelected, onChange, isDisabled }: CompactSwitchProps) {
  return (
    <SwitchField isSelected={isSelected} onChange={onChange} isDisabled={isDisabled}>
      <SwitchButton
        className={cn(
          "flex items-center gap-1.5",
          "data-disabled:opacity-50",
          "data-focus-visible:rounded-sm data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-accent",
        )}
      >
        {({ isSelected }) => (
          <>
            <div
              className={cn(
                "flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors",
                isSelected ? "border-accent bg-btn" : "border-subtle bg-surface",
              )}
            >
              <div
                className={cn(
                  "ml-0.5 size-3 rounded-full transition-transform",
                  isSelected ? "translate-x-3 bg-white" : "bg-control",
                )}
              />
            </div>
            <span className={cn("text-xs", isSelected ? "text-app" : "text-muted")}>{label}</span>
          </>
        )}
      </SwitchButton>
    </SwitchField>
  );
}

// --- Round row ---

type Round = {
  id: number;
  nr: number;
  published: boolean;
  tipsPublished: boolean;
};

function RoundRow({ round }: { round: Round }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";

  const pendingField = fetcher.formData?.get("field") as RoundFlagField | undefined;
  const pendingValue = fetcher.formData?.get("value") === "true";

  function getFlag(field: RoundFlagField, serverValue: boolean) {
    return pendingField === field ? pendingValue : serverValue;
  }

  function toggle(field: RoundFlagField, current: boolean) {
    void fetcher.submit(
      { intent: "toggle-round-flag", roundId: String(round.id), field, value: String(!current) },
      { method: "post" },
    );
  }

  const published = getFlag("published", round.published);
  const tipsPublished = getFlag("tipsPublished", round.tipsPublished);

  // Dependency chain: published → tipsPublished; once tips are public, round can't be unpublished
  const publishedDisabled = isPending || tipsPublished;
  const tipsPublishedDisabled = isPending || !published;

  return (
    <div className="flex items-center gap-4 py-3">
      <span className="text-muted w-8 text-right text-sm tabular-nums">{round.nr}</span>
      <div className="flex flex-1 gap-6">
        <CompactSwitch
          label="Spiele öffentlich"
          isSelected={published}
          onChange={() => toggle("published", published)}
          isDisabled={publishedDisabled}
        />
        <CompactSwitch
          label="Tipps öffentlich"
          isSelected={tipsPublished}
          onChange={() => toggle("tipsPublished", tipsPublished)}
          isDisabled={tipsPublishedDisabled}
        />
      </div>
      <Link
        to={`spiele/${round.nr}`}
        title={`Spiele der Runde ${round.nr}`}
        aria-label={`Spiele der Runde ${round.nr}`}
        className={cn(
          "text-muted rounded-sm p-1 transition-colors",
          "hover:bg-nav-active hover:text-app",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        )}
      >
        <CalendarIcon className="size-4" />
      </Link>
    </div>
  );
}

// --- Page ---

export default function ChampionshipIndex({ loaderData }: Route.ComponentProps) {
  const { championship, hasExtraQuestions, roundList } = loaderData;

  const flagFetcher = useFetcher();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isFlagPending = flagFetcher.state !== "idle";
  const nextNr = roundList.length > 0 ? Math.max(...roundList.map((r) => r.nr)) + 1 : 1;

  const pendingField = flagFetcher.formData?.get("field") as FlagField | undefined;
  const pendingValue = flagFetcher.formData?.get("value") === "true";

  function getFlag(field: FlagField, serverValue: boolean) {
    return pendingField === field ? pendingValue : serverValue;
  }

  function toggleFlag(field: FlagField, current: boolean) {
    void flagFetcher.submit({ field, value: String(!current) }, { method: "post" });
  }

  const published = getFlag("published", championship.published);
  const completed = getFlag("completed", championship.completed);
  const extraQuestionsPublished = getFlag(
    "extraQuestionsPublished",
    championship.extraQuestionsPublished,
  );

  // Dependency chain: published → extraQuestionsPublished (if present) → completed
  // Turning completed on disables all other switches
  const publishedDisabled = isFlagPending || completed;
  const extraQuestionsDisabled = isFlagPending || !published || completed;
  const completedDisabled =
    isFlagPending || !published || (hasExtraQuestions && !extraQuestionsPublished);

  return (
    <div className="space-y-6 p-8">
      <title>{`Übersicht | ${championship.name}`}</title>

      {/* Turnier-Status */}
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
              isDisabled={publishedDisabled}
            />
            {hasExtraQuestions && (
              <FlagSwitch
                label="Zusatzpunkte veröffentlicht"
                description="Auswertung der Zusatzfragen ist auf dem Frontend sichtbar"
                isSelected={extraQuestionsPublished}
                onChange={() => toggleFlag("extraQuestionsPublished", extraQuestionsPublished)}
                isDisabled={extraQuestionsDisabled}
              />
            )}
            <FlagSwitch
              label="Abgeschlossen"
              description="Turnier ist beendet. Abschließen löst Neuberechnung aus"
              isSelected={completed}
              onChange={() => toggleFlag("completed", completed)}
              isDisabled={completedDisabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Runden */}
      <Card>
        <div className="border-subtle flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-sm font-semibold">Runden</h2>
          <Button
            onPress={() => setIsCreateOpen(true)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "bg-btn text-btn hover:bg-btn-hover",
              "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
            )}
          >
            <PlusIcon className="size-3.5" />
            Neue Runde
          </Button>
        </div>
        <CardContent>
          {roundList.length === 0 ? (
            <p className="text-subtle py-4 text-center text-sm">Noch keine Runden angelegt.</p>
          ) : (
            <div className="divide-subtle divide-y">
              {roundList.map((round) => (
                <RoundRow key={round.id} round={round} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RundeDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} nextNr={nextNr} />
    </div>
  );
}
