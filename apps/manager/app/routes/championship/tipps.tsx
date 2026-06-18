import { tips as tipsTable } from "@tipprunde/db/schema";
import { applyMatchRule, calcTipPoints, type TipRuleId } from "@tipprunde/domain/scoring";
import { Button, Checkbox, Label } from "@tipprunde/ui";
import { and, eq } from "drizzle-orm";
import { ChevronDownIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import {
  Button as RACButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { redirect, useFetcher, useNavigate } from "react-router";

import { db } from "#/lib/db.server.ts";
import { updateRanking } from "#/lib/ranking.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { RoundNavigator } from "../../components/round-navigator";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/tipps";

export const handle = { title: "Tipps" };

export async function loader({ params, context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const requestedPlayerSlug = params.playerSlug ?? null;

  const [rounds, playerList, ruleset] = await Promise.all([
    db.query.rounds.findMany({
      where: { championshipId: championship.id },
      columns: { id: true, nr: true },
      orderBy: { nr: "asc" },
    }),
    db.query.players.findMany({
      where: { championshipId: championship.id },
      with: { user: { columns: { id: true, slug: true, name: true } } },
    }),
    championship.rulesetId
      ? db.query.rulesets.findFirst({
          where: { id: championship.rulesetId },
          columns: { jokerRuleId: true },
        })
      : Promise.resolve(null),
  ]);

  const players = playerList.sort((a, b) => a.user.name.localeCompare(b.user.name));

  if (players.length === 0) {
    return {
      players,
      rounds,
      allMatches: [],
      jokerRuleId: null,
      defaultNr: null,
      currentPlayerSlug: null,
      slug: championship.slug,
      championshipName: championship.name,
    };
  }

  // Redirect to first player when param is missing or invalid
  const currentPlayer = requestedPlayerSlug
    ? players.find((p) => p.user.slug === requestedPlayerSlug)
    : null;

  if (!currentPlayer) {
    throw redirect(`/${championship.slug}/tipps/${players[0].user!.slug}`);
  }

  if (rounds.length === 0) {
    return {
      players,
      rounds,
      allMatches: [],
      jokerRuleId: ruleset?.jokerRuleId ?? null,
      defaultNr: null,
      currentPlayerSlug: currentPlayer.user!.slug,
      slug: championship.slug,
      championshipName: championship.name,
    };
  }

  // Load all matches for the championship with this player's tips nested
  const roundIds = rounds.map((r) => r.id);
  const allMatches = await db.query.matches.findMany({
    where: { roundId: { in: roundIds } },
    columns: { id: true, nr: true, roundId: true },
    with: {
      hometeam: { columns: { name: true } },
      awayteam: { columns: { name: true } },
      tips: {
        where: { userId: currentPlayer.userId },
        columns: { tip: true, joker: true, extraJoker: true },
      },
    },
    orderBy: { nr: "asc" },
  });

  return {
    players,
    rounds,
    allMatches,
    jokerRuleId: ruleset?.jokerRuleId ?? null,
    defaultNr: rounds.at(-1)!.nr,
    currentPlayerSlug: currentPlayer.user!.slug,
    currentUserId: currentPlayer.userId,
    slug: championship.slug,
    championshipName: championship.name,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const championship = context.get(championshipContext);
  const formData = await request.formData();

  if (formData.get("intent") === "update-tip") {
    const matchId = Number(formData.get("matchId"));
    const userId = Number(formData.get("userId"));

    if (!Number.isInteger(matchId) || matchId <= 0 || !Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    const tip = (formData.get("tip") as string) || null;
    const joker = formData.get("joker") === "true";
    const extraJoker = formData.get("extraJoker") === "true";

    const [match, player, ruleset] = await Promise.all([
      db.query.matches.findFirst({
        where: { id: matchId },
        with: { round: { columns: { championshipId: true, isDoubleRound: true } } },
      }),
      db.query.players.findFirst({
        where: { userId, championshipId: championship.id },
      }),
      championship.rulesetId
        ? db.query.rulesets.findFirst({
            where: { id: championship.rulesetId },
            columns: { tipRuleId: true },
          })
        : Promise.resolve(null),
    ]);

    if (!match || !match.round || match.round.championshipId !== championship.id || !player) {
      return { ok: false };
    }

    await db
      .insert(tipsTable)
      .values({ matchId, userId, tip, joker, extraJoker })
      .onConflictDoUpdate({
        target: [tipsTable.matchId, tipsTable.userId],
        set: { tip, joker, extraJoker },
      });

    const tipRuleId = ruleset?.tipRuleId as TipRuleId | undefined;

    if (match.result && tipRuleId) {
      const points = calcTipPoints(
        tip,
        match.result,
        tipRuleId,
        match.round.isDoubleRound,
        joker,
        extraJoker,
      );
      await db
        .update(tipsTable)
        .set({ points })
        .where(and(eq(tipsTable.matchId, matchId), eq(tipsTable.userId, userId)));
      applyMatchRule();
      await updateRanking(championship.id);
    }
  }

  return { ok: true };
}

// --- Tip grid ---

const TIP_PATTERN = /^\d{1,2}:\d{1,2}$/;

function normalizeTip(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/[-.]/g, ":").replace(/:+/g, ":");
}

type TipEntry = { tip: string; joker: boolean; extraJoker: boolean; invalid?: boolean };

type TipMatch = {
  id: number;
  nr: number;
  hometeam: { name: string } | null;
  awayteam: { name: string } | null;
  tips: { tip: string | null; joker: boolean | null; extraJoker: boolean | null }[];
};

type TipGridProps = {
  matches: TipMatch[];
  currentUserId: number;
  jokerRuleId: string | null;
  jokerCount: number;
  roundJokerCount: number;
  hasExtraJoker: boolean;
  extraJokerCount: number;
};

function TipGrid({
  matches,
  currentUserId,
  jokerRuleId,
  jokerCount,
  roundJokerCount,
  hasExtraJoker,
  extraJokerCount,
}: TipGridProps) {
  const fetcher = useFetcher();

  const [tipEntries, setTipEntries] = useState<Record<number, TipEntry>>(() => {
    const entries: Record<number, TipEntry> = {};
    for (const match of matches) {
      const t = match.tips[0];
      if (t)
        entries[match.id] = {
          tip: t.tip ?? "",
          joker: t.joker ?? false,
          extraJoker: t.extraJoker ?? false,
        };
    }
    return entries;
  });

  function isJokerAllowed(matchId: number): boolean {
    if (tipEntries[matchId]?.extraJoker) return false;
    const currentlyChecked = tipEntries[matchId]?.joker ?? false;
    if (
      jokerRuleId === "einmal-pro-runde" ||
      jokerRuleId === "einmal-pro-runde-plus-zwei-zusatzjoker"
    )
      return roundJokerCount === 0 || currentlyChecked;
    if (jokerRuleId === "zwei-pro-turnier") return jokerCount < 2 || currentlyChecked;
    return false;
  }

  function isExtraJokerAllowed(matchId: number): boolean {
    if (tipEntries[matchId]?.joker) return false;
    const currentlyChecked = tipEntries[matchId]?.extraJoker ?? false;
    return extraJokerCount < 2 || currentlyChecked;
  }

  function getTip(matchId: number): TipEntry {
    return tipEntries[matchId] ?? { tip: "", joker: false, extraJoker: false };
  }

  function updateTip(matchId: number, update: Partial<TipEntry>) {
    setTipEntries((prev) => ({ ...prev, [matchId]: { ...getTip(matchId), ...update } }));
  }

  function saveTip(matchId: number, entry: TipEntry) {
    void fetcher.submit(
      {
        intent: "update-tip",
        matchId: String(matchId),
        userId: String(currentUserId),
        tip: entry.tip,
        joker: String(entry.joker),
        extraJoker: String(entry.extraJoker),
      },
      { method: "post" },
    );
  }

  function applyPastedTips(text: string, startMatchId: number) {
    const startIndex = matches.findIndex((m) => m.id === startMatchId);
    if (startIndex === -1) return;

    const newEntries: Record<number, TipEntry> = {};

    text
      .trimEnd()
      .split(/\r?\n/)
      .slice(0, matches.length - startIndex)
      .forEach((raw, offset) => {
        const match = matches[startIndex + offset];
        const trimmed = raw.trim();
        const normalized = trimmed ? normalizeTip(trimmed) : "";
        const isValid = normalized !== "" && TIP_PATTERN.test(normalized);
        const joker = getTip(match.id).joker;
        const extraJoker = getTip(match.id).extraJoker;

        newEntries[match.id] = {
          tip: normalized,
          joker,
          extraJoker,
          invalid: normalized !== "" && !isValid,
        };

        if (isValid || normalized === "") {
          saveTip(match.id, { tip: normalized, joker, extraJoker });
        }
      });

    setTipEntries((prev) => ({ ...prev, ...newEntries }));
  }

  function handleTipPaste(matchId: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (text.trimEnd().split(/\r?\n/).length <= 1) return; // single value — let native paste + onBlur handle it
    e.preventDefault();
    applyPastedTips(text, matchId);
  }

  async function handleClipboardPaste() {
    const text = await navigator.clipboard.readText();
    if (!text.trim() || matches.length === 0) return;
    applyPastedTips(text, matches[0].id);
  }

  function handleTipBlur(matchId: number) {
    const entry = getTip(matchId);
    const raw = entry.tip.trim();

    if (!raw) {
      updateTip(matchId, { tip: "", invalid: false });
      saveTip(matchId, { ...entry, tip: "" });
      return;
    }

    const normalized = normalizeTip(raw);
    const isValid = TIP_PATTERN.test(normalized);

    updateTip(matchId, { tip: normalized, invalid: !isValid });

    if (isValid) {
      saveTip(matchId, { ...entry, tip: normalized });
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
          <th className="text-muted px-2 pb-3 text-center font-medium">
            <div className="flex items-center justify-center gap-1">
              <span>Tipp</span>
              <Button
                intent="ghost"
                size="icon"
                onPress={() => void handleClipboardPaste()}
                aria-label="Tipps aus Zwischenablage einfügen"
                className="p-0.5"
              >
                <ClipboardIcon className="size-3.5" />
              </Button>
            </div>
          </th>
          <th className="text-muted pb-3 pl-2 text-center font-medium">Joker</th>
          {hasExtraJoker && <th className="text-muted pb-3 pl-2 text-center font-medium">Extra</th>}
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
                value={getTip(match.id).tip}
                onChange={(e) => updateTip(match.id, { tip: e.target.value, invalid: false })}
                onBlur={() => handleTipBlur(match.id)}
                onPaste={(e) => handleTipPaste(match.id, e)}
                aria-label={`Tipp für Spiel ${match.nr}`}
                aria-invalid={getTip(match.id).invalid}
                className={cn(
                  "border-subtle w-12 rounded-sm border px-2 py-1 text-sm text-center outline-none focus:ring-2 focus:ring-accent",
                  getTip(match.id).invalid
                    ? "bg-error dark:bg-surface dark:text-error"
                    : "bg-surface",
                )}
              />
            </td>
            <td className="py-3 pl-2 text-center">
              <Checkbox
                isSelected={getTip(match.id).joker}
                isDisabled={!isJokerAllowed(match.id)}
                onChange={(checked) => {
                  const updated = { ...getTip(match.id), joker: checked };
                  updateTip(match.id, { joker: checked });
                  saveTip(match.id, updated);
                }}
                aria-label={`Joker für Spiel ${match.nr}`}
              />
            </td>
            {hasExtraJoker && (
              <td className="py-3 pl-2 text-center">
                <Checkbox
                  isSelected={getTip(match.id).extraJoker}
                  isDisabled={!isExtraJokerAllowed(match.id)}
                  onChange={(checked) => {
                    const updated = { ...getTip(match.id), extraJoker: checked };
                    updateTip(match.id, { extraJoker: checked });
                    saveTip(match.id, updated);
                  }}
                  aria-label={`Extra-Joker für Spiel ${match.nr}`}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Page ---

export default function Tipps({ loaderData }: Route.ComponentProps) {
  const {
    players,
    rounds,
    allMatches,
    jokerRuleId,
    defaultNr,
    currentPlayerSlug,
    currentUserId,
    slug,
    championshipName,
  } = loaderData;
  const navigate = useNavigate();
  const [currentNr, setCurrentNr] = useState(defaultNr ?? 0);

  if (players.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Tipps | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Spieler im Turnier.</p>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Tipps | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Spiele angelegt.</p>
      </div>
    );
  }

  const currentRound = rounds.find((r) => r.nr === currentNr);
  const currentMatches = allMatches.filter((m) => m.roundId === currentRound?.id);

  // Joker counts derived from server-confirmed data (allMatches)
  const hasExtraJoker = jokerRuleId === "einmal-pro-runde-plus-zwei-zusatzjoker";
  const jokerCount = allMatches.filter((m) => m.tips[0]?.joker).length;
  const roundJokerCount = currentMatches.filter((m) => m.tips[0]?.joker).length;
  const extraJokerCount = allMatches.filter((m) => m.tips[0]?.extraJoker).length;

  return (
    <div className="space-y-6 p-8">
      <title>{`Tipps | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center">
        <RoundNavigator
          currentNr={currentNr}
          totalRounds={rounds.length}
          onNavigate={setCurrentNr}
        />
      </div>

      <Card>
        <CardContent>
          <Select
            aria-label="Spieler auswählen"
            value={currentPlayerSlug}
            onChange={(v) => v !== null && void navigate(`/${slug}/tipps/${v}`)}
            className="flex flex-col gap-1.5"
          >
            <Label>Spieler</Label>
            <RACButton
              className={cn(
                "border-subtle bg-surface flex w-full items-center justify-between rounded-sm border px-3 py-1.5 text-sm outline-none",
                "hover:bg-nav-active",
                "data-focused:ring-2 data-focused:ring-accent",
              )}
            >
              <SelectValue />
              <ChevronDownIcon className="text-muted size-4 shrink-0" />
            </RACButton>
            <Popover className="bg-surface-raised border-subtle w-(--trigger-width) rounded-sm border shadow-lg outline-none">
              <ListBox items={players} className="max-h-72 overflow-y-auto p-1 outline-none">
                {(player) => (
                  <ListBoxItem
                    id={player.user.slug}
                    textValue={player.user.name}
                    className={cn(
                      "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
                      "hover:bg-nav-active data-focused:bg-nav-active data-selected:bg-accent-subtle",
                    )}
                  >
                    {player.user.name}
                  </ListBoxItem>
                )}
              </ListBox>
            </Popover>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TipGrid
            key={`${currentPlayerSlug}-${currentNr}`}
            matches={currentMatches}
            currentUserId={currentUserId!}
            jokerRuleId={jokerRuleId}
            jokerCount={jokerCount}
            roundJokerCount={roundJokerCount}
            hasExtraJoker={hasExtraJoker}
            extraJokerCount={extraJokerCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
