import {
  extraAnswers as extraAnswersTable,
  extraQuestions as extraQuestionsTable,
} from "@tipprunde/db/schema";
import { Button } from "@tipprunde/ui";
import { and, eq } from "drizzle-orm";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button as RACButton, Input, TextField } from "react-aria-components";
import { useFetcher } from "react-router";

import { db } from "#/lib/db.server.ts";
import { isLocked } from "#/lib/lock.server.ts";
import { updateRanking } from "#/lib/ranking.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { LockProvider, useLock } from "../../components/lock-provider";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/zusatzfragen";

export const handle = { title: "Zusatzfragen" };

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
    championshipCompleted: championship.completed,
  };
}

// --- Action ---

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // All zusatzfragen mutations are championship-scoped — locked when completed.
  if (isLocked({ championshipCompleted: championship.completed })) {
    return { ok: false, locked: true };
  }

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
    if (championship.extraQuestionPointsPublished) {
      await updateRanking(championship.id);
    }
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
    if (championship.extraQuestionPointsPublished) {
      await updateRanking(championship.id);
    }
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
  const { isChampionshipClosed } = useLock();
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
  const [pointsInputs, setPointsInputs] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    for (const ea of question.extraAnswers) {
      if (ea.points !== null) map[ea.userId] = String(ea.points).replace(".", ",");
    }
    return map;
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [answersOpen, setAnswersOpen] = useState(false);

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
    const serverAnswer = question.extraAnswers.find((ea) => ea.userId === userId)?.answer ?? "";
    if (playerAnswer === serverAnswer) return;
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

  function handlePointsSave(userId: number) {
    const raw = pointsInputs[userId]?.trim() ?? "";
    const serverPoints = question.extraAnswers.find((ea) => ea.userId === userId)?.points ?? null;

    if (raw === "") {
      if (serverPoints !== null) {
        void fetcher.submit(
          { intent: "remove-points", questionId: String(question.id), userId: String(userId) },
          { method: "post" },
        );
      }
      return;
    }

    const parsed = Number(raw.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      // Invalid input → revert the field to the server value.
      setPointsInputs((prev) => ({
        ...prev,
        [userId]: serverPoints !== null ? String(serverPoints).replace(".", ",") : "",
      }));
      return;
    }
    if (parsed === serverPoints) return;

    void fetcher.submit(
      {
        intent: "upsert-points",
        questionId: String(question.id),
        userId: String(userId),
        points: String(parsed),
      },
      { method: "post" },
    );
  }

  const earnerCount = question.extraAnswers.filter((ea) => ea.points !== null).length;

  return (
    <Card>
      <div className="border-subtle flex items-start justify-between gap-3 border-b px-6 py-3">
        <TextField
          aria-label="Frage"
          value={questionText}
          onChange={setQuestionText}
          onBlur={() => {
            const trimmed = questionText.trim();
            if (!trimmed) {
              setQuestionText(question.question);
              return;
            }
            if (trimmed !== question.question) saveField("question", trimmed);
          }}
          className="min-w-0 flex-1"
        >
          <Input
            ref={questionInputRef}
            placeholder="Frage eingeben ..."
            className="placeholder:text-muted w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal"
          />
        </TextField>
        {!isChampionshipClosed && (
          <>
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
          </>
        )}
      </div>

      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Beschreibung</p>
            <TextField
              aria-label="Beschreibung"
              value={description}
              onChange={setDescription}
              onBlur={() => {
                const trimmed = description.trim();
                if (trimmed !== question.description) saveField("description", trimmed);
              }}
            >
              <Input
                placeholder="Punkteverteilung beschreiben ..."
                className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-full rounded-sm border px-3 py-1.5 text-sm outline-none focus:ring-2"
              />
            </TextField>
          </div>

          {/* Official answer */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Antwort</p>
            <TextField
              aria-label="Antwort"
              value={answer}
              onChange={setAnswer}
              onBlur={() => {
                const trimmed = answer.trim();
                if (trimmed !== (question.answer ?? "")) saveField("answer", trimmed);
              }}
            >
              <Input
                placeholder="Noch keine Antwort ..."
                className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-full rounded-sm border px-3 py-1.5 text-sm outline-none focus:ring-2"
              />
            </TextField>
          </div>

          {/* Player answers & points — collapsible */}
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
              Antworten &amp; Punkte ({players.length})
              {earnerCount > 0 && (
                <span className="text-accent normal-case">· {earnerCount}× Punkte</span>
              )}
            </RACButton>

            {answersOpen && (
              <div className="mt-2 space-y-1">
                {players.map((player) => (
                  <div key={player.userId} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-sm">{player.user.name}</span>
                    <TextField
                      aria-label={`Antwort von ${player.user.name}`}
                      value={answerInputs[player.userId] ?? ""}
                      onChange={(v) => setAnswerInputs((prev) => ({ ...prev, [player.userId]: v }))}
                      onBlur={() => handleSavePlayerAnswer(player.userId)}
                      className="min-w-0 flex-1"
                    >
                      <Input
                        placeholder="Keine Antwort ..."
                        className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-full rounded-sm border px-3 py-1 text-sm outline-none focus:ring-2"
                      />
                    </TextField>
                    <TextField
                      aria-label={`Punkte für ${player.user.name}`}
                      value={pointsInputs[player.userId] ?? ""}
                      onChange={(v) => setPointsInputs((prev) => ({ ...prev, [player.userId]: v }))}
                      onBlur={() => handlePointsSave(player.userId)}
                      className="shrink-0"
                    >
                      <Input
                        inputMode="decimal"
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        placeholder="Pkt."
                        className="border-subtle bg-surface placeholder:text-muted focus:ring-accent w-14 rounded-sm border px-2 py-1 text-center text-sm outline-none focus:ring-2"
                      />
                    </TextField>
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

export default function Zusatzfragen({ loaderData }: Route.ComponentProps) {
  const { hasExtraQuestions, questions, players, championshipName, championshipCompleted } =
    loaderData;
  const createFetcher = useFetcher();

  if (!hasExtraQuestions) {
    return (
      <div className="p-8">
        <title>{`Zusatzfragen | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle mt-8 text-center text-sm">
          Keine Zusatzfragen in diesem Turnier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <title>{`Zusatzfragen | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center justify-end">
        <Button
          size="sm"
          isDisabled={championshipCompleted}
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
        <LockProvider isChampionshipClosed={championshipCompleted}>
          <div className="space-y-6">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} players={players} />
            ))}
          </div>
        </LockProvider>
      )}
    </div>
  );
}
