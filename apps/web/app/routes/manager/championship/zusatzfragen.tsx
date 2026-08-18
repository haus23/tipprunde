import {
  extraAnswers as extraAnswersTable,
  extraQuestions as extraQuestionsTable,
} from "@tipprunde/db/schema";
import { Button, Card, CardContent, Disclosure, Input, cx } from "@tipprunde/ui";
import { and, eq } from "drizzle-orm";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button as RACButton, TextField } from "react-aria-components";
import { useFetcher } from "react-router";

import { championshipContext } from "#/lib/context.ts";
import { db } from "#/lib/db.server.ts";
import { isLocked } from "#/lib/lock.server.ts";
import { updateRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/zusatzfragen";
import { LockProvider, useLock } from "./_lock-provider.tsx";

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

function formatPoints(points: number): string {
  return (Number.isInteger(points) ? String(points) : points.toFixed(1)).replace(".", ",");
}

// --- Question card ---

function QuestionCard({
  index,
  question,
  players,
}: {
  index: number;
  question: Question;
  players: EnrolledPlayer[];
}) {
  const fetcher = useFetcher();
  const { isChampionshipClosed } = useLock();

  const [questionText, setQuestionText] = useState(question.question);
  const [description, setDescription] = useState(question.description);
  const [answer, setAnswer] = useState(question.answer ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const earnerCount = question.extraAnswers.filter((ea) => ea.points !== null).length;
  const answersByUser = new Map(question.extraAnswers.map((ea) => [ea.userId, ea]));

  return (
    <Card>
      <div className="border-subtle flex items-center justify-between gap-3 border-b px-6 py-3">
        <h3 className="text-sm font-semibold">Zusatzfrage {index + 1}</h3>
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
          {/* Question — required, flagged red while empty so a blank title can't hide */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Frage</p>
            {isChampionshipClosed ? (
              <p className="text-sm">{question.question || "–"}</p>
            ) : (
              <TextField
                aria-label="Frage"
                isRequired
                value={questionText}
                onChange={setQuestionText}
                onBlur={() => {
                  const trimmed = questionText.trim();
                  if (trimmed !== question.question) saveField("question", trimmed);
                }}
              >
                <Input
                  autoFocus={!question.question}
                  placeholder="Frage eingeben ..."
                  className={cx("w-full", !questionText.trim() && "border-error")}
                />
              </TextField>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Beschreibung</p>
            {isChampionshipClosed ? (
              <p className="text-sm">{question.description || "–"}</p>
            ) : (
              <TextField
                aria-label="Beschreibung"
                value={description}
                onChange={setDescription}
                onBlur={() => {
                  const trimmed = description.trim();
                  if (trimmed !== question.description) saveField("description", trimmed);
                }}
              >
                <Input placeholder="Punkteverteilung beschreiben ..." className="w-full" />
              </TextField>
            )}
          </div>

          {/* Official answer */}
          <div className="space-y-1.5">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Antwort</p>
            {isChampionshipClosed ? (
              <p className="text-sm">{question.answer || "–"}</p>
            ) : (
              <TextField
                aria-label="Antwort"
                value={answer}
                onChange={setAnswer}
                onBlur={() => {
                  const trimmed = answer.trim();
                  if (trimmed !== (question.answer ?? "")) saveField("answer", trimmed);
                }}
              >
                <Input placeholder="Noch keine Antwort ..." className="w-full" />
              </TextField>
            )}
          </div>

          {/* Player answers & points — native disclosure */}
          <Disclosure
            title={
              <span className="text-muted text-xs font-medium tracking-wide uppercase">
                Antworten &amp; Punkte ({players.length})
                {earnerCount > 0 && (
                  <span className="text-accent ml-1 normal-case">· {earnerCount}× Punkte</span>
                )}
              </span>
            }
            className="border-subtle border-t"
            summaryClassName="px-2 py-1.5 hover:bg-transparent"
            bodyClassName="mt-2 pb-0"
          >
            <div className="space-y-2 py-0.5">
              {players.map((player) => (
                <PlayerAnswerRow
                  key={player.userId}
                  questionId={question.id}
                  player={player}
                  extraAnswer={answersByUser.get(player.userId)}
                />
              ))}
            </div>
          </Disclosure>
        </div>
      </CardContent>
    </Card>
  );
}

// Each row owns its own fetcher (keyed via useId() internally) so that
// saving one player's answer/points can never abort another's in-flight save.
function PlayerAnswerRow({
  questionId,
  player,
  extraAnswer,
}: {
  questionId: number;
  player: EnrolledPlayer;
  extraAnswer: ExtraAnswer | undefined;
}) {
  const fetcher = useFetcher();
  const { isChampionshipClosed } = useLock();

  const [answerInput, setAnswerInput] = useState(extraAnswer?.answer ?? "");
  const [pointsInput, setPointsInput] = useState(
    extraAnswer?.points != null ? formatPoints(extraAnswer.points) : "",
  );

  function handleSaveAnswer() {
    const playerAnswer = answerInput.trim();
    const serverAnswer = extraAnswer?.answer ?? "";
    if (playerAnswer === serverAnswer) return;
    void fetcher.submit(
      {
        intent: "save-answer",
        questionId: String(questionId),
        userId: String(player.userId),
        answer: playerAnswer,
      },
      { method: "post" },
    );
  }

  function handleSavePoints() {
    const raw = pointsInput.trim();
    const serverPoints = extraAnswer?.points ?? null;

    if (raw === "") {
      if (serverPoints !== null) {
        void fetcher.submit(
          {
            intent: "remove-points",
            questionId: String(questionId),
            userId: String(player.userId),
          },
          { method: "post" },
        );
      }
      return;
    }

    const parsed = Number(raw.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      // Invalid input → revert the field to the server value.
      setPointsInput(serverPoints !== null ? formatPoints(serverPoints) : "");
      return;
    }
    if (parsed === serverPoints) return;

    void fetcher.submit(
      {
        intent: "upsert-points",
        questionId: String(questionId),
        userId: String(player.userId),
        points: String(parsed),
      },
      { method: "post" },
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 truncate text-sm">{player.user.name}</span>
      {isChampionshipClosed ? (
        <>
          <span className="min-w-0 flex-1 text-sm">{extraAnswer?.answer || "–"}</span>
          <span className="w-14 shrink-0 text-center text-sm tabular-nums">
            {extraAnswer?.points != null ? formatPoints(extraAnswer.points) : "–"}
          </span>
        </>
      ) : (
        <>
          <TextField
            aria-label={`Antwort von ${player.user.name}`}
            value={answerInput}
            onChange={setAnswerInput}
            onBlur={handleSaveAnswer}
            className="min-w-0 flex-1"
          >
            <Input placeholder="Keine Antwort ..." className="w-full" />
          </TextField>
          <TextField
            aria-label={`Punkte für ${player.user.name}`}
            value={pointsInput}
            onChange={setPointsInput}
            onBlur={handleSavePoints}
            className="shrink-0"
          >
            <Input
              inputMode="decimal"
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              placeholder="Pkt."
              className="w-14 text-center"
            />
          </TextField>
        </>
      )}
    </div>
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
            {questions.map((q, i) => (
              <QuestionCard key={q.id} index={i} question={q} players={players} />
            ))}
          </div>
        </LockProvider>
      )}
    </div>
  );
}
