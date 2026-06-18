import {
  championships,
  players as playersTable,
  roundPoints as roundPointsTable,
  rounds as roundsTable,
} from "@tipprunde/db/schema";
import { calcGoalDeviation } from "@tipprunde/domain/scoring";
import { Button } from "@tipprunde/ui";
import { and, eq, max } from "drizzle-orm";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { SwitchButton, SwitchField } from "react-aria-components";
import { Link, useFetcher } from "react-router";
import * as v from "valibot";

import { db } from "#/lib/db.server.ts";
import { updateRanking } from "#/lib/ranking.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { MitspielerCard } from "../../components/mitspieler-card";
import { RundeDialog } from "../../components/runde-dialog";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/index";

export const handle = { title: "Übersicht" };

const flagField = v.picklist(["published", "completed", "extraQuestionPointsPublished"]);
type FlagField = v.InferOutput<typeof flagField>;

const roundFlagField = v.picklist(["published", "tipsPublished"]);
type RoundFlagField = v.InferOutput<typeof roundFlagField>;

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const [ruleset, roundList, playerList, allUsers] = await Promise.all([
    db.query.rulesets.findFirst({
      where: { id: championship.rulesetId },
      columns: { extraQuestionRuleId: true, roundRuleId: true },
    }),
    db.query.rounds.findMany({
      where: { championshipId: championship.id },
      columns: { id: true, nr: true, published: true, tipsPublished: true, completed: true },
      orderBy: { nr: "asc" },
    }),
    db.query.players.findMany({
      where: { championshipId: championship.id },
      columns: { userId: true },
    }),
    db.query.users.findMany({
      orderBy: { name: "asc" },
      columns: { id: true, name: true, slug: true },
    }),
  ]);
  return {
    championship,
    hasExtraQuestions: ruleset?.extraQuestionRuleId === "mit-zusatzfragen",
    hasDeviationRule: ruleset?.roundRuleId === "torabweichung-bonus-malus",
    roundList,
    playerUserIds: playerList.map((p) => p.userId),
    allUsers,
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

  if (intent === "toggle-round-completed") {
    const roundId = Number(formData.get("roundId"));
    const value = formData.get("value") === "true";

    // Always clean up old roundPoints entries for this round first
    await db.delete(roundPointsTable).where(eq(roundPointsTable.roundId, roundId));

    if (value) {
      // Fetch all matches in this round with results, nested with all tips
      const roundMatches = await db.query.matches.findMany({
        where: { roundId },
        columns: { id: true, result: true },
        with: {
          tips: { columns: { userId: true, tip: true } },
        },
      });

      const matchesWithResult = roundMatches.filter((m) => m.result !== null);

      if (matchesWithResult.length > 0) {
        // Collect all player userIds from tips across all matches
        const allUserIds = [
          ...new Set(matchesWithResult.flatMap((m) => m.tips.map((t) => t.userId))),
        ];

        // Calculate deviation sum per player
        const deviations = allUserIds.map((userId) => {
          const sum = matchesWithResult.reduce((acc, m) => {
            const tip = m.tips.find((t) => t.userId === userId);
            return acc + calcGoalDeviation(tip?.tip ?? null, m.result!);
          }, 0);
          return { userId, sum };
        });

        if (deviations.length > 0) {
          const minDev = Math.min(...deviations.map((d) => d.sum));
          const maxDev = Math.max(...deviations.map((d) => d.sum));

          const entries: { roundId: number; userId: number; points: number }[] = [];
          for (const { userId, sum } of deviations) {
            if (sum === minDev && minDev !== maxDev) entries.push({ roundId, userId, points: 1 });
            else if (sum === maxDev && minDev !== maxDev)
              entries.push({ roundId, userId, points: -1 });
          }
          if (entries.length > 0) {
            await db.insert(roundPointsTable).values(entries);
          }
        }
      }
    }

    await db
      .update(roundsTable)
      .set({ completed: value || false })
      .where(eq(roundsTable.id, roundId));

    // Re-fetch the championshipId for this round to update the ranking
    const round = await db.query.rounds.findFirst({
      where: { id: roundId },
      columns: { championshipId: true },
    });
    if (round) await updateRanking(round.championshipId);

    return null;
  }

  if (intent === "add-player") {
    const userId = Number(formData.get("userId"));
    await db
      .insert(playersTable)
      .values({ championshipId: championship.id, userId, rank: 1, tipPoints: 0, total: 0 })
      .onConflictDoNothing();
    return null;
  }

  if (intent === "remove-player") {
    const userId = Number(formData.get("userId"));
    await db
      .delete(playersTable)
      .where(
        and(eq(playersTable.championshipId, championship.id), eq(playersTable.userId, userId)),
      );
    return null;
  }

  // Championship flag toggle
  const field = v.parse(flagField, formData.get("field"));
  const value = formData.get("value") === "true";
  await db
    .update(championships)
    .set({ [field]: value })
    .where(eq(championships.id, championship.id));
  if (field === "extraQuestionPointsPublished") {
    await updateRanking(championship.id);
  }
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
                isSelected ? "border-accent bg-accent" : "border-subtle bg-surface",
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
                isSelected ? "border-accent bg-accent" : "border-subtle bg-surface",
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
  completed: boolean | null;
};

function RoundRow({ round, hasDeviationRule }: { round: Round; hasDeviationRule: boolean }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";

  const pendingField = fetcher.formData?.get("field") as RoundFlagField | undefined;
  const pendingValue = fetcher.formData?.get("value") === "true";
  const pendingCompleted =
    fetcher.formData?.get("intent") === "toggle-round-completed"
      ? fetcher.formData?.get("value") === "true"
      : undefined;

  function getFlag(field: RoundFlagField, serverValue: boolean) {
    return pendingField === field ? pendingValue : serverValue;
  }

  function toggle(field: RoundFlagField, current: boolean) {
    void fetcher.submit(
      { intent: "toggle-round-flag", roundId: String(round.id), field, value: String(!current) },
      { method: "post" },
    );
  }

  function toggleCompleted(current: boolean) {
    void fetcher.submit(
      { intent: "toggle-round-completed", roundId: String(round.id), value: String(!current) },
      { method: "post" },
    );
  }

  const published = getFlag("published", round.published);
  const tipsPublished = getFlag("tipsPublished", round.tipsPublished);
  const completed = pendingCompleted ?? round.completed ?? false;

  // Dependency chain: published → tipsPublished → completed
  // Once completed, published and tipsPublished are locked
  const publishedDisabled = isPending || tipsPublished || completed;
  const tipsPublishedDisabled = isPending || !published || completed;
  const completedDisabled = isPending || !tipsPublished;

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
        {hasDeviationRule && (
          <CompactSwitch
            label="Abgeschlossen"
            isSelected={completed}
            onChange={() => toggleCompleted(completed)}
            isDisabled={completedDisabled}
          />
        )}
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
  const { championship, hasExtraQuestions, hasDeviationRule, roundList, playerUserIds, allUsers } =
    loaderData;

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
  const extraQuestionPointsPublished = getFlag(
    "extraQuestionPointsPublished",
    championship.extraQuestionPointsPublished,
  );

  // Dependency chain: published → extraQuestionPointsPublished (if present) → completed
  // Turning completed on disables all other switches
  const publishedDisabled = isFlagPending || completed;
  const extraQuestionsDisabled = isFlagPending || !published || completed;
  const completedDisabled =
    isFlagPending || !published || (hasExtraQuestions && !extraQuestionPointsPublished);

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
                label="Zusatzfragenpunkte veröffentlicht"
                description="Auswertung der Zusatzfragen ist auf dem Frontend sichtbar"
                isSelected={extraQuestionPointsPublished}
                onChange={() =>
                  toggleFlag("extraQuestionPointsPublished", extraQuestionPointsPublished)
                }
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
            size="sm"
            onPress={() => setIsCreateOpen(true)}
            className="gap-1.5 px-2.5 text-xs"
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
                <RoundRow key={round.id} round={round} hasDeviationRule={hasDeviationRule} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RundeDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} nextNr={nextNr} />

      <MitspielerCard playerUserIds={playerUserIds} allUsers={allUsers} />
    </div>
  );
}
