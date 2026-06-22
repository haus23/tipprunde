import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, StarIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button, Dialog, OverlayArrow, Popover } from "react-aria-components";

import { CellLink } from "#/components/cell-link.tsx";
import type { RankedPlayer } from "#/lib/ranking.ts";
import { matchdayTipsQueryOptions } from "#/lib/spiele.ts";

export function RankingTable({
  ranking,
  showExtras,
  currentUserId,
  championshipId,
  isOngoing,
  linkPlayers = true,
}: {
  ranking: RankedPlayer[];
  showExtras: boolean;
  currentUserId: number | undefined;
  championshipId: number;
  isOngoing: boolean;
  linkPlayers?: boolean;
}) {
  const showTotal = showExtras;
  return (
    <table className="w-full border-collapse text-base">
      <thead>
        <tr className="text-muted text-xs tracking-wide uppercase">
          <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-right font-medium">
            Platz
          </th>
          <th className="border-subtle xs:px-3 xs:py-2.5 border-b px-2 py-2 text-left font-medium">
            Spieler
          </th>
          {showExtras && (
            <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
              <span className="xs:inline hidden">Zusatzpunkte</span>
              <span className="xs:hidden">Zusatzpkt.</span>
            </th>
          )}
          <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
            {showTotal ? (
              <>
                <span className="xs:inline hidden">Gesamtpunkte</span>
                <span className="xs:hidden">Gesamt</span>
              </>
            ) : (
              "Punkte"
            )}
          </th>
          {isOngoing && <th className="border-subtle w-px border-b px-2 py-2" />}
        </tr>
      </thead>
      <tbody>
        {ranking.map((entry, index) => {
          const isCurrentUser = currentUserId === entry.userId;
          const sharesRankAbove = index > 0 && ranking[index - 1].rank === entry.rank;
          return (
            <tr
              key={entry.userId}
              className={`border-subtle border-b transition-colors last:border-0 ${
                isCurrentUser
                  ? "bg-accent-subtle"
                  : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-raised"
              }`}
            >
              <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-right tabular-nums">
                {sharesRankAbove ? "" : entry.rank}
              </td>
              <td className={`xs:px-3 xs:py-3 px-2 py-2 ${isCurrentUser ? "font-medium" : ""}`}>
                {linkPlayers ? (
                  <CellLink to="/tipps/{-$slug}" params={{ slug: entry.slug }}>
                    {entry.name}
                  </CellLink>
                ) : (
                  entry.name
                )}
              </td>
              {showExtras && (
                <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-center tabular-nums">
                  {entry.extraQuestionPoints}
                </td>
              )}
              <td className="xs:px-3 xs:py-3 px-2 py-2 text-center font-medium tabular-nums">
                {entry.total}
              </td>
              {isOngoing && (
                <td className="xs:px-3 xs:py-3 py-2 pr-4">
                  <MatchdayButton
                    championshipId={championshipId}
                    userId={entry.userId}
                    name={entry.name}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MatchdayButton({
  championshipId,
  userId,
  name,
}: {
  championshipId: number;
  userId: number;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(ev: PointerEvent) {
      if (
        buttonRef.current?.contains(ev.target as Node) ||
        popoverRef.current?.contains(ev.target as Node)
      )
        return;
      setIsOpen(false);
    }
    window.addEventListener("pointerdown", handleOutsideClick, { capture: true });
    return () => window.removeEventListener("pointerdown", handleOutsideClick, { capture: true });
  }, [isOpen]);

  const { data, isPending } = useQuery({
    ...matchdayTipsQueryOptions(championshipId, userId),
    enabled: isOpen,
  });

  const matches = data?.matches ?? [];

  return (
    <>
      <Button
        ref={buttonRef}
        onPress={() => setIsOpen((v) => !v)}
        aria-label={`Aktuelle Tipps von ${name}`}
        className="text-subtle hover:text-app focus-visible:ring-accent cursor-default rounded-sm p-1 transition-colors outline-none focus-visible:ring-2"
      >
        <CalendarIcon size={13} />
      </Button>
      <Popover
        ref={popoverRef}
        triggerRef={buttonRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isNonModal
        crossOffset={16}
        containerPadding={4}
        placement="bottom end"
        className="bg-surface border-subtle shadow-popover relative min-w-60 rounded-lg border p-3 text-sm transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0 data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom"
      >
        <OverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="block fill-(--background-color-surface) stroke-(--border-color-subtle) stroke-1 group-data-[placement=bottom]:rotate-180"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog className="flex flex-col outline-none">
          <p className="text-subtle border-subtle bg-surface absolute -top-2 self-center rounded-sm border px-2 py-1 text-xs font-medium">
            {name}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted border-subtle border-b">
                <th className="pr-3 pb-1.5 text-left font-medium">Spiel</th>
                <th className="px-2 pb-1.5 text-center font-medium">Tipp</th>
                <th className="pb-1.5 text-center font-medium">Pkt</th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="border-subtle border-b last:border-0">
                    <td className="py-1.5 pr-3">
                      <div className="bg-surface-raised h-3 w-24 animate-pulse rounded" />
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="bg-surface-raised mx-auto h-3 w-6 animate-pulse rounded" />
                    </td>
                    <td className="py-1.5">
                      <div className="bg-surface-raised mx-auto h-3 w-4 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : matches.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-subtle pt-2 text-xs">
                    Keine aktuellen Spiele.
                  </td>
                </tr>
              ) : (
                matches.map((m) => (
                  <tr key={m.nr} className="border-subtle border-b last:border-0">
                    <td className="py-1.5 pr-3">
                      <CellLink to="/spiele/$nr" params={{ nr: String(m.nr) }}>
                        {m.paarungShort}
                      </CellLink>
                    </td>
                    <td className="px-2 py-1.5 text-center tabular-nums">
                      <span className="relative">
                        {m.tip ?? "–"}
                        {m.isFlagged && (
                          <StarIcon className="text-accent absolute top-1/2 -right-3.5 size-3 -translate-y-1/2 fill-current" />
                        )}
                      </span>
                    </td>
                    <td className="py-1.5 text-center tabular-nums">
                      {m.points !== null ? m.points : "–"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Dialog>
      </Popover>
    </>
  );
}
