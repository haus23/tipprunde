import {
  extraAnswers as extraAnswersTable,
  extraQuestions as extraQuestionsTable,
} from "@tipprunde/db/schema";
import { Button } from "@tipprunde/ui";
import { and, eq } from "drizzle-orm";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button as RACButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/zusatzpunkte";

export const handle = { title: "Zusatzpunkte" };

// --- Loader ---

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);

  const [ruleset, questions, playerList] = await Promise.all([
    championship.rulesetId
      ? db.query.rulesets.findFirst({
          where: { id: championship.rulesetId },
          columns: { extraQuestionRuleId: true },
        })
      : Promise.resolve(null),
    db.query.extraQuestions.findMany({
      where: { championshipId: championship.id },
      with: {
        extraAnswers: {
          with: { user: { columns: { id: true, name: true } } },
        },
      },
      orderBy: { id: "asc" },
    }),
    db.query.players.findMany({
      where: { championshipId: championship.id },
      with: { user: { columns: { id: true, name: true } } },
    }),
  ]);

  const players = playerList.sort((a, b) => a.user.name.localeCompare(b.user.name));

  return {
    hasExtraQuestions: ruleset?.extraQuestionRuleId === "mit-zusatzfragen",
    questions,
    players,
    championshipName: championship.name,
  };
}

// --- Action ---

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-question") {
    await db
      .insert(extraQuestionsTable)
      .values({ championshipId: championship.id, question: "", description: "" });
    return { ok: true };
  }

  if (intent === "update-question") {
    const questionId = Number(formData.get("questionId"));
    if (!Number.isInteger(questionId) || questionId <= 0) return null;

    const field = formData.get("field") as string;
    if (!["question", "description", "answer"].includes(field)) return null;

    const value = (formData.get("value") as string) || null;

    const question = await db.query.extraQuestions.findFirst({
      where: { id: questionId, championshipId: championship.id },
    });
    if (!question) return { ok: false };

    await db
      .update(extraQuestionsTable)
      .set(
        field === "question"
          ? { question: value ?? "" }
          : field === "description"
            ? { description: value ?? "" }
            : { answer: value },
      )
      .where(eq(extraQuestionsTable.id, questionId));
    return { ok: true };
  }

  if (intent === "delete-question") {
    const questionId = Number(formData.get("questionId"));
    if (!Number.isInteger(questionId) || questionId <= 0) return null;

    const question = await db.query.extraQuestions.findFirst({
      where: { id: questionId, championshipId: championship.id },
    });
    if (!question) return { ok: false };

    await db.delete(extraAnswersTable).where(eq(extraAnswersTable.extraQuestionId, questionId));
    await db.delete(extraQuestionsTable).where(eq(extraQuestionsTable.id, questionId));
    return { ok: true };
  }

  if (intent === "save-answer") {
    const questionId = Number(formData.get("questionId"));
    const userId = Number(formData.get("userId"));
    if (!Number.isInteger(questionId) || questionId <= 0) return null;
    if (!Number.isInteger(userId) || userId <= 0) return null;

    const answer = (formData.get("answer") as string) || null;

    const [question, player] = await Promise.all([
      db.query.extraQuestions.findFirst({
        where: { id: questionId, championshipId: championship.id },
      }),
      db.query.players.findFirst({
        where: { userId, championshipId: championship.id },
      }),
    ]);
    if (!question || !player) return { ok: false };

    await db
      .insert(extraAnswersTable)
      .values({ extraQuestionId: questionId, userId, answer })
      .onConflictDoUpdate({
        target: [extraAnswersTable.extraQuestionId, extraAnswersTable.userId],
        set: { answer },
      });
    return { ok: true };
  }

  if (intent === "upsert-points") {
    const questionId = Number(formData.get("questionId"));
    const userId = Number(formData.get("userId"));
    const points = Number((formData.get("points") as string).replace(",", "."));

    if (!Number.isInteger(questionId) || questionId <= 0) return null;
    if (!Number.isInteger(userId) || userId <= 0) return null;
    if (!Number.isFinite(points) || points <= 0) return null;

    const [question, player] = await Promise.all([
      db.query.extraQuestions.findFirst({
        where: { id: questionId, championshipId: championship.id },
      }),
      db.query.players.findFirst({
        where: { userId, championshipId: championship.id },
      }),
    ]);
    if (!question || !player) return { ok: false };

    await db
      .insert(extraAnswersTable)
      .values({ extraQuestionId: questionId, userId, points })
      .onConflictDoUpdate({
        target: [extraAnswersTable.extraQuestionId, extraAnswersTable.userId],
        set: { points },
      });
    return { ok: true };
  }

  if (intent === "remove-points") {
    const questionId = Number(formData.get("questionId"));
    const userId = Number(formData.get("userId"));

    if (!Number.isInteger(questionId) || questionId <= 0) return null;
    if (!Number.isInteger(userId) || userId <= 0) return null;

    await db
      .update(extraAnswersTable)
      .set({ points: null })
      .where(
        and(
          eq(extraAnswersTable.extraQuestionId, questionId),
          eq(extraAnswersTable.userId, userId),
        ),
      );
    return { ok: true };
  }

  return { ok: true };
}

// --- Types ---

type ExtraAnswer = {
  userId: number;
  answer: string | null;
  points: number | null;
  user: { id: number; name: string };
};

type Question = {
  id: number;
  question: string;
  description: string;
  answer: string | null;
  extraAnswers: ExtraAnswer[];
};

type EnrolledPlayer = {
  userId: number;
  user: { id: number; name: string };
};

// --- Question card ---

function QuestionCard({ question, players }: { question: Question; players: EnrolledPlayer[] }) {
  const fetcher = useFetcher();
  const questionInputRef = useRef<HTMLInputElement>(null);

  const [questionText, setQuestionText] = useState(question.question);
  const [description, setDescription] = useState(question.description);
  const [answer, setAnswer] = useState(question.answer ?? "");
  const [answerInputs, setAnswerInputs] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    for (const ea of question.extraAnswers) {
      map[ea.userId] = ea.answer ?? "";
    }
    return map;
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [answersOpen, setAnswersOpen] = useState(false);
  const [showAddEarner, setShowAddEarner] = useState(false);
  const [newEarnerUserId, setNewEarnerUserId] = useState<string | null>(null);
  const [newEarnerPoints, setNewEarnerPoints] = useState("");

  useEffect(() => {
    if (!question.question) questionInputRef.current?.focus();
  }, []);

  function saveField(field: string, value: string) {
    void fetcher.submit(
      { intent: "update-question", questionId: String(question.id), field, value },
      { method: "post" },
    );
  }

  function handleDelete() {
    void fetcher.submit(
      { intent: "delete-question", questionId: String(question.id) },
      { method: "post" },
    );
  }

  function handleSavePlayerAnswer(userId: number) {
    const playerAnswer = answerInputs[userId]?.trim() ?? "";
    void fetcher.submit(
      {
        intent: "save-answer",
        questionId: String(question.id),
        userId: String(userId),
        answer: playerAnswer,
      },
      { method: "post" },
    );
  }

  function handleAddEarner() {
    if (!newEarnerUserId) return;
    const parsed = Number(newEarnerPoints.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    void fetcher.submit(
      {
        intent: "upsert-points",
        questionId: String(question.id),
        userId: newEarnerUserId,
        points: String(parsed),
      },
      { method: "post" },
    );
    setNewEarnerUserId(null);
    setNewEarnerPoints("");
    setShowAddEarner(false);
  }

  function handleRemovePoints(userId: number) {
    void fetcher.submit(
      { intent: "remove-points", questionId: String(question.id), userId: String(userId) },
      { method: "post" },
    );
  }

  const earners = question.extraAnswers.filter((ea) => ea.points !== null);
  const earnerUserIds = new Set(earners.map((ea) => ea.userId));
  const availablePlayers = players.filter((p) => !earnerUserIds.has(p.userId));

  return (
    <Card>
      <div className="border-subtle flex items-start justify-between gap-3 border-b px-6 py-3">
        <input
          ref={questionInputRef}
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onBlur={() => {
            const trimmed = questionText.trim();
            if (trimmed) saveField("question", trimmed);
            else setQuestionText(question.question);
          }}
          placeholder="Frage eingeben ..."
          className="placeholder:text-muted min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:font-normal"
        />
        {showDeleteConfirm ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-muted text-xs">Löschen?</span>
            <RACButton
              onPress={handleDelete}
              className="text-error text-xs outline-none hover:underline data-focused:underline"
            >
              Ja
            </RACButton>
            <RACButton
              onPress={() => setShowDeleteConfirm(false)}
              className="text-muted text-xs outline-none hover:underline data-focused:underline"
            >
              Nein
            </RACButton>
          </div>
        ) : (
          <Button
            intent="ghost"
            size="icon"
            onPress={() => setShowDeleteConfirm(true)}
            aria-label="Frage löschen"
            className="hover:text-error shrink-0 p-1"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Beschreibung</p>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => saveField("description", description.trim())}
              placeholder="Punkteverteilung beschreiben ..."
              className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-full rounded-sm border px-3 py-1.5 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Official answer */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Antwort</p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onBlur={() => saveField("answer", answer.trim())}
              placeholder="Noch keine Antwort ..."
              className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-full rounded-sm border px-3 py-1.5 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Points — always visible once answer is set */}
          {question.answer && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-muted text-xs font-medium tracking-wide uppercase">Punkte</p>
                {availablePlayers.length > 0 && !showAddEarner && (
                  <RACButton
                    onPress={() => setShowAddEarner(true)}
                    className={cn(
                      "flex items-center gap-1 rounded-sm text-muted text-xs transition-colors",
                      "hover:text-app",
                      "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
                    )}
                  >
                    <PlusIcon className="size-3" />
                    Spieler
                  </RACButton>
                )}
              </div>

              {earners.length === 0 && !showAddEarner && (
                <p className="text-subtle text-sm">Noch keine Punkte vergeben.</p>
              )}

              {earners.length > 0 && (
                <div className="space-y-1">
                  {earners.map((ea) => (
                    <div key={ea.userId} className="flex items-center gap-2">
                      <span className="flex-1 text-sm">{ea.user.name}</span>
                      <span className="text-sm tabular-nums">
                        {Number.isInteger(ea.points) ? ea.points : ea.points!.toFixed(1)}
                      </span>
                      <Button
                        intent="ghost"
                        size="icon"
                        onPress={() => handleRemovePoints(ea.userId)}
                        aria-label={`Punkte für ${ea.user.name} entfernen`}
                        className="hover:text-error p-0.5"
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {showAddEarner && (
                <div className="flex items-center gap-2">
                  <Select
                    aria-label="Spieler auswählen"
                    value={newEarnerUserId}
                    onChange={(v) => setNewEarnerUserId(v !== null ? String(v) : null)}
                    placeholder="Spieler ..."
                    className="min-w-0 flex-1"
                  >
                    <RACButton
                      className={cn(
                        "border-subtle bg-surface flex w-full items-center justify-between rounded-sm border px-2 py-1 text-sm outline-none",
                        "data-focused:ring-2 data-focused:ring-accent",
                      )}
                    >
                      <SelectValue className="data-placeholder:text-muted" />
                      <ChevronDownIcon className="text-muted size-3.5 shrink-0" />
                    </RACButton>
                    <Popover className="bg-surface-raised border-subtle w-(--trigger-width) rounded-sm border shadow-lg outline-none">
                      <ListBox
                        items={availablePlayers}
                        className="max-h-48 overflow-y-auto p-1 outline-none"
                      >
                        {(player) => (
                          <ListBoxItem
                            id={String(player.userId)}
                            textValue={player.user.name}
                            className={cn(
                              "cursor-pointer rounded-sm px-2.5 py-1 text-sm outline-none",
                              "hover:bg-nav-active data-focused:bg-nav-active",
                            )}
                          >
                            {player.user.name}
                          </ListBoxItem>
                        )}
                      </ListBox>
                    </Popover>
                  </Select>

                  <input
                    type="text"
                    value={newEarnerPoints}
                    onChange={(e) => setNewEarnerPoints(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEarner()}
                    placeholder="Pkt."
                    className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-14 rounded-sm border px-2 py-1 text-center text-sm outline-none focus:ring-2"
                  />

                  <Button
                    size="sm"
                    onPress={handleAddEarner}
                    isDisabled={!newEarnerUserId || !newEarnerPoints}
                    className="shrink-0 px-2.5 py-1"
                  >
                    Hinzufügen
                  </Button>

                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => {
                      setShowAddEarner(false);
                      setNewEarnerUserId(null);
                      setNewEarnerPoints("");
                    }}
                    aria-label="Abbrechen"
                    className="shrink-0 p-1"
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Player answers — collapsible */}
          <div className="border-subtle border-t pt-3">
            <RACButton
              onPress={() => setAnswersOpen((o) => !o)}
              className={cn(
                "flex w-full items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wide",
                "outline-none hover:text-app",
                "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent rounded-sm",
              )}
            >
              {answersOpen ? (
                <ChevronDownIcon className="size-3.5" />
              ) : (
                <ChevronRightIcon className="size-3.5" />
              )}
              Antworten ({players.length})
            </RACButton>

            {answersOpen && (
              <div className="mt-2 space-y-1">
                {players.map((player) => (
                  <div key={player.userId} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-sm">{player.user.name}</span>
                    <input
                      type="text"
                      value={answerInputs[player.userId] ?? ""}
                      onChange={(e) =>
                        setAnswerInputs((prev) => ({
                          ...prev,
                          [player.userId]: e.target.value,
                        }))
                      }
                      onBlur={() => handleSavePlayerAnswer(player.userId)}
                      placeholder="Keine Antwort ..."
                      className="border-subtle bg-surface placeholder:text-muted focus:ring-accent min-w-0 flex-1 rounded-sm border px-3 py-1 text-sm outline-none focus:ring-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Page ---

export default function Zusatzpunkte({ loaderData }: Route.ComponentProps) {
  const { hasExtraQuestions, questions, players, championshipName } = loaderData;
  const createFetcher = useFetcher();

  if (!hasExtraQuestions) {
    return (
      <div className="p-8">
        <title>{`Zusatzpunkte | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle mt-8 text-center text-sm">
          Keine Zusatzfragen in diesem Turnier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <title>{`Zusatzpunkte | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center justify-end">
        <Button
          size="sm"
          onPress={() =>
            void createFetcher.submit({ intent: "create-question" }, { method: "post" })
          }
          className="gap-1.5"
        >
          <PlusIcon className="size-4" />
          Neue Frage
        </Button>
      </div>

      {questions.length === 0 ? (
        <p className="text-subtle text-center text-sm">Noch keine Zusatzfragen festgelegt.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} players={players} />
          ))}
        </div>
      )}
    </div>
  );
}
