import { matches as matchesTable } from "@tipprunde/db/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { redirect, useFetcher, useNavigate } from "react-router";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { RoundNavigator } from "../../components/round-navigator";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/ergebnisse";

export const handle = { title: "Ergebnisse" };

// --- Loader ---

export async function loader({ params, context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);

  const rounds = await db.query.rounds.findMany({
    where: { championshipId: championship.id },
    columns: { id: true, nr: true },
    orderBy: { nr: "asc" },
  });

  const lastRound = rounds.at(-1);
  if (!lastRound) {
    return { currentNr: null, championshipName: championship.name };
  }

  const requestedNr = params.nr ? Number(params.nr) : null;
  const currentNr = requestedNr ?? lastRound.nr;

  if (!rounds.some((r) => r.nr === currentNr)) {
    throw redirect(`/${championship.slug}/ergebnisse/${lastRound.nr}`);
  }

  const currentRoundId = rounds.find((r) => r.nr === currentNr)!.id;

  const matches = await db.query.matches.findMany({
    where: { roundId: currentRoundId },
    columns: { id: true, nr: true, result: true },
    with: {
      hometeam: { columns: { name: true } },
      awayteam: { columns: { name: true } },
    },
    orderBy: { nr: "asc" },
  });

  return {
    rounds,
    currentNr,
    matches,
    slug: championship.slug,
    championshipName: championship.name,
  };
}

// --- Action ---

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();

  if (formData.get("intent") === "update-result") {
    const matchId = Number(formData.get("matchId"));

    if (!Number.isInteger(matchId) || matchId <= 0) return null;

    const result = (formData.get("result") as string) || null;

    const match = await db.query.matches.findFirst({
      where: { id: matchId },
      with: { round: { columns: { championshipId: true } } },
    });

    if (match?.round?.championshipId !== championship.id) {
      return { ok: false };
    }

    await db.update(matchesTable).set({ result }).where(eq(matchesTable.id, matchId));
  }

  return { ok: true };
}

// --- Result grid ---

const RESULT_PATTERN = /^\d{1,2}:\d{1,2}$/;

function normalizeResult(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/[-.]/g, ":").replace(/:+/g, ":");
}

type ResultEntry = { result: string; invalid?: boolean };

type ResultMatch = {
  id: number;
  nr: number;
  result: string | null;
  hometeam: { name: string } | null;
  awayteam: { name: string } | null;
};

function ResultGrid({ matches }: { matches: ResultMatch[] }) {
  const fetcher = useFetcher();

  const [resultEntries, setResultEntries] = useState<Record<number, ResultEntry>>(() => {
    const entries: Record<number, ResultEntry> = {};
    for (const match of matches) {
      if (match.result) entries[match.id] = { result: match.result };
    }
    return entries;
  });

  function getResult(matchId: number): ResultEntry {
    return resultEntries[matchId] ?? { result: "" };
  }

  function updateResult(matchId: number, update: Partial<ResultEntry>) {
    setResultEntries((prev) => ({ ...prev, [matchId]: { ...getResult(matchId), ...update } }));
  }

  function saveResult(matchId: number, result: string) {
    void fetcher.submit(
      { intent: "update-result", matchId: String(matchId), result },
      { method: "post" },
    );
  }

  function handleResultBlur(matchId: number) {
    const entry = getResult(matchId);
    const raw = entry.result.trim();

    if (!raw) {
      updateResult(matchId, { result: "", invalid: false });
      saveResult(matchId, "");
      return;
    }

    const normalized = normalizeResult(raw);
    const isValid = RESULT_PATTERN.test(normalized);

    updateResult(matchId, { result: normalized, invalid: !isValid });

    if (isValid) {
      saveResult(matchId, normalized);
    }
  }

  if (matches.length === 0) {
    return <p className="text-subtle text-center text-sm">Noch keine Spiele in dieser Runde.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-subtle border-b">
          <th className="text-muted pr-2 pb-3 text-right font-medium">#</th>
          <th className="text-muted px-2 pb-3 text-left font-medium">Spiel</th>
          <th className="text-muted px-2 pb-3 text-center font-medium">Ergebnis</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.id} className="border-subtle border-b last:border-0">
            <td className="text-muted py-3 pr-2 text-right tabular-nums">{match.nr}</td>
            <td className="px-2 py-3">
              {match.hometeam?.name ?? "?"} – {match.awayteam?.name ?? "?"}
            </td>
            <td className="px-2 py-3 text-center">
              <input
                type="text"
                value={getResult(match.id).result}
                onChange={(e) => updateResult(match.id, { result: e.target.value, invalid: false })}
                onBlur={() => handleResultBlur(match.id)}
                aria-label={`Ergebnis für Spiel ${match.nr}`}
                aria-invalid={getResult(match.id).invalid}
                className={cn(
                  "border-subtle w-12 rounded-sm border px-2 py-1 text-sm text-center outline-none focus:ring-2 focus:ring-accent",
                  getResult(match.id).invalid
                    ? "bg-error dark:bg-surface dark:text-error"
                    : "bg-surface",
                )}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Page ---

export default function Ergebnisse({ loaderData }: Route.ComponentProps) {
  const { rounds, currentNr, championshipName } = loaderData;
  const navigate = useNavigate();

  if (currentNr === null) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Ergebnisse | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Runden angelegt.</p>
      </div>
    );
  }

  const { matches, slug } = loaderData;

  return (
    <div className="space-y-6 p-8">
      <title>{`Ergebnisse | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center">
        <RoundNavigator
          currentNr={currentNr}
          totalRounds={rounds.length}
          onNavigate={(nr) => void navigate(`/${slug}/ergebnisse/${nr}`)}
        />
      </div>
      <Card>
        <CardContent>
          <ResultGrid matches={matches} />
        </CardContent>
      </Card>
    </div>
  );
}
