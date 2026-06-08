import { tips as tipsTable } from "@tipprunde/db/schema";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  CheckboxButton,
  CheckboxField,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { redirect, useFetcher } from "react-router";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "../../components/card";
import { RoundNavigator } from "../../components/round-navigator";
import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/tipps";

export const handle = { title: "Tipps" };

export async function loader({ params, context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);

  const [rounds, playerList] = await Promise.all([
    db.query.rounds.findMany({
      where: { championshipId: championship.id },
      columns: { id: true, nr: true },
      orderBy: { nr: "asc" },
    }),
    db.query.players.findMany({
      where: { championshipId: championship.id },
      with: { user: true },
    }),
  ]);

  const players = playerList.sort((a, b) => (a.user?.name ?? "").localeCompare(b.user?.name ?? ""));

  const lastRound = rounds.at(-1);
  if (!lastRound) {
    return {
      currentNr: null,
      players,
      slug: championship.slug,
      championshipName: championship.name,
    };
  }

  const requestedNr = params.nr ? Number(params.nr) : null;
  const currentNr = requestedNr ?? lastRound.nr;

  if (!rounds.some((r) => r.nr === currentNr)) {
    throw redirect(`/${championship.slug}/tipps/${lastRound.nr}`);
  }

  const currentRound = rounds.find((r) => r.nr === currentNr)!;
  const matches = await db.query.matches.findMany({
    where: { roundId: currentRound.id },
    columns: { id: true, nr: true },
    with: {
      hometeam: { columns: { name: true } },
      awayteam: { columns: { name: true } },
    },
    orderBy: { nr: "asc" },
  });

  const matchIds = matches.map((m) => m.id);
  const tips =
    matchIds.length > 0
      ? await db.query.tips.findMany({
          where: { matchId: { in: matchIds } },
          columns: { matchId: true, userId: true, tip: true, joker: true },
        })
      : [];

  return {
    rounds,
    currentNr,
    players,
    matches,
    tips,
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
    const tip = (formData.get("tip") as string) || null;
    const joker = formData.get("joker") === "true";

    const [match, player] = await Promise.all([
      db.query.matches.findFirst({
        where: { id: matchId },
        with: { round: { columns: { championshipId: true } } },
      }),
      db.query.players.findFirst({
        where: { userId, championshipId: championship.id },
      }),
    ]);

    if (match?.round?.championshipId !== championship.id || !player) {
      return null;
    }

    await db
      .insert(tipsTable)
      .values({ matchId, userId, tip, joker })
      .onConflictDoUpdate({
        target: [tipsTable.matchId, tipsTable.userId],
        set: { tip, joker },
      });
  }

  return null;
}

const TIP_PATTERN = /^\d{1,2}:\d{1,2}$/;

function normalizeTip(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/[-.]/g, ":").replace(/:+/g, ":");
}

type TipEntry = { tip: string; joker: boolean; invalid?: boolean };

export default function Tipps({ loaderData }: Route.ComponentProps) {
  const { rounds, currentNr, players, matches, tips, slug, championshipName } = loaderData;

  const [playerId, setPlayerId] = useState(players.at(0)?.id ?? 0);
  const [tipEntries, setTipEntries] = useState<Record<number, TipEntry>>({});
  const fetcher = useFetcher();

  const currentUserId = players.find((p) => p.id === playerId)?.user?.id;

  useEffect(() => {
    const playerTips: Record<number, TipEntry> = {};
    for (const t of tips ?? []) {
      if (t.userId === currentUserId) {
        playerTips[t.matchId] = { tip: t.tip ?? "", joker: t.joker ?? false };
      }
    }
    setTipEntries(playerTips);
  }, [playerId, currentNr]);

  if (players.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Tipps | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Spieler im Turnier.</p>
      </div>
    );
  }

  if (currentNr === null) {
    return (
      <div className="space-y-6 p-8">
        <title>{`Tipps | ${championshipName}`}</title>
        <div className="mb-6 flex min-h-9 items-center" />
        <p className="text-subtle text-center text-sm">Noch keine Spiele angelegt.</p>
      </div>
    );
  }

  function getTip(matchId: number): TipEntry {
    return tipEntries[matchId] ?? { tip: "", joker: false };
  }

  function updateTip(matchId: number, update: Partial<TipEntry>) {
    setTipEntries((prev) => ({ ...prev, [matchId]: { ...getTip(matchId), ...update } }));
  }

  function saveTip(matchId: number, entry: TipEntry) {
    if (!currentUserId) return;
    void fetcher.submit(
      {
        intent: "update-tip",
        matchId: String(matchId),
        userId: String(currentUserId),
        tip: entry.tip,
        joker: String(entry.joker),
      },
      { method: "post" },
    );
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

  return (
    <div className="space-y-6 p-8">
      <title>{`Tipps | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center">
        <RoundNavigator currentNr={currentNr} totalRounds={rounds.length} base={`/${slug}/tipps`} />
      </div>

      <Card>
        <CardContent>
          <Select
            aria-label="Spieler auswählen"
            value={playerId}
            onChange={(v) => v !== null && setPlayerId(Number(v))}
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium">Spieler</Label>
            <Button
              className={cn(
                "border-subtle bg-surface flex w-full items-center justify-between rounded-sm border px-3 py-1.5 text-sm outline-none",
                "hover:bg-nav-active",
                "data-focused:ring-2 data-focused:ring-accent",
              )}
            >
              <SelectValue />
              <ChevronDownIcon className="text-muted size-4 shrink-0" />
            </Button>
            <Popover className="bg-surface-raised border-subtle w-(--trigger-width) rounded-sm border shadow-lg outline-none">
              <ListBox items={players} className="max-h-72 overflow-y-auto p-1 outline-none">
                {(player) => (
                  <ListBoxItem
                    id={player.id}
                    textValue={player.user?.name ?? ""}
                    className={cn(
                      "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
                      "hover:bg-nav-active data-focused:bg-nav-active data-selected:bg-accent-subtle",
                    )}
                  >
                    {player.user?.name ?? ""}
                  </ListBoxItem>
                )}
              </ListBox>
            </Popover>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {(matches ?? []).length === 0 ? (
            <p className="text-subtle text-center text-sm">Noch keine Spiele in dieser Runde.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-subtle border-b">
                  <th className="text-muted pr-2 pb-3 text-right font-medium">#</th>
                  <th className="text-muted px-2 pb-3 text-left font-medium">Spiel</th>
                  <th className="text-muted px-2 pb-3 text-center font-medium">Tipp</th>
                  <th className="text-muted pb-3 pl-2 text-center font-medium">Joker</th>
                </tr>
              </thead>
              <tbody>
                {(matches ?? []).map((match) => (
                  <tr key={match.id} className="border-subtle border-b last:border-0">
                    <td className="text-muted py-3 pr-2 text-right tabular-nums">{match.nr}</td>
                    <td className="px-2 py-3">
                      {match.hometeam?.name ?? "?"} – {match.awayteam?.name ?? "?"}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <input
                        type="text"
                        value={getTip(match.id).tip}
                        onChange={(e) =>
                          updateTip(match.id, { tip: e.target.value, invalid: false })
                        }
                        onBlur={() => handleTipBlur(match.id)}
                        aria-label={`Tipp für Spiel ${match.nr}`}
                        aria-invalid={getTip(match.id).invalid}
                        className={cn(
                          "bg-surface w-12 rounded-sm border px-2 py-1 text-sm text-center outline-none",
                          getTip(match.id).invalid
                            ? "border-error"
                            : "border-subtle focus:ring-2 focus:ring-accent",
                        )}
                      />
                    </td>
                    <td className="py-3 pl-2 text-center">
                      <CheckboxField
                        isSelected={getTip(match.id).joker}
                        onChange={(checked) => {
                          const updated = { ...getTip(match.id), joker: checked };
                          updateTip(match.id, { joker: checked });
                          saveTip(match.id, updated);
                        }}
                        aria-label={`Joker für Spiel ${match.nr}`}
                        className="flex justify-center"
                      >
                        <CheckboxButton
                          className={cn(
                            "group flex size-5 cursor-pointer items-center justify-center rounded border outline-none transition-colors",
                            "border-subtle",
                            "data-selected:border-accent data-selected:bg-accent",
                            "data-focused:ring-2 data-focused:ring-accent",
                          )}
                        >
                          <CheckIcon className="size-3 stroke-4 text-transparent group-data-selected:text-white" />
                        </CheckboxButton>
                      </CheckboxField>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
