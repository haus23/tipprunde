import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button, Popover } from "react-aria-components";

import { CellLink } from "#/components/cell-link.tsx";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";
import type { SessionUser } from "#/lib/session.ts";
import { matchdayTipsQueryOptions } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/tabelle")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      return context.queryClient.ensureQueryData(rankingQueryOptions(id));
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <TabelleView championship={championship} user={user} />;
}

function TabelleView({
  championship,
  user,
}: {
  championship: NonNullable<ReturnType<typeof Route.useRouteContext>["championship"]>;
  user: SessionUser | null;
}) {
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championship.id));
  const showExtras = championship.extraQuestionPointsPublished ?? false;
  const isOngoing = !championship.completed;

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <p className="text-subtle text-sm">
          {championship.completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
        </p>
      </div>

      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
      ) : (
        <RankingTable
          ranking={ranking}
          showExtras={showExtras}
          currentUserId={user?.id}
          championshipId={championship.id}
          isOngoing={isOngoing}
        />
      )}
    </div>
  );
}

function RankingTable({
  ranking,
  showExtras,
  currentUserId,
  championshipId,
  isOngoing,
}: {
  ranking: RankedPlayer[];
  showExtras: boolean;
  currentUserId: number | undefined;
  championshipId: number;
  isOngoing: boolean;
}) {
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
            {showExtras ? (
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
                isCurrentUser ? "bg-accent-subtle" : "hover:bg-surface-raised"
              }`}
            >
              <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-right tabular-nums">
                {sharesRankAbove ? "" : entry.rank}
              </td>
              <td className={`xs:px-3 xs:py-3 px-2 py-2 ${isCurrentUser ? "font-medium" : ""}`}>
                <CellLink to="/spieler/{-$slug}" params={{ slug: entry.slug }}>
                  {entry.name}
                </CellLink>
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
                <td className="xs:px-3 xs:py-3 px-2 py-2">
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

  const { data } = useQuery({
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
        className="text-subtle hover:text-app focus-visible:ring-accent cursor-default rounded-sm outline-none focus-visible:ring-2"
      >
        <CalendarIcon size={13} />
      </Button>
      <Popover
        ref={popoverRef}
        triggerRef={buttonRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isNonModal
        placement="bottom end"
        className="bg-surface border-subtle shadow-popover min-w-52 rounded-lg border p-3 text-sm transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0 data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom"
      >
        <p className="text-subtle mb-2 text-xs font-medium">{name}</p>
        {matches.length === 0 ? (
          <p className="text-subtle text-xs">Keine aktuellen Spiele.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted border-subtle border-b">
                <th className="pr-3 pb-1.5 text-left font-medium">Spiel</th>
                <th className="px-2 pb-1.5 text-center font-medium">Erg.</th>
                <th className="px-2 pb-1.5 text-center font-medium">Tipp</th>
                <th className="pb-1.5 text-center font-medium">Pkt</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.nr} className="border-subtle border-b last:border-0">
                  <td className="py-1.5 pr-3">
                    <CellLink to="/spiele/$nr" params={{ nr: String(m.nr) }}>
                      {m.paarungShort}
                    </CellLink>
                  </td>
                  <td className="px-2 py-1.5 text-center tabular-nums">{m.result ?? "–:–"}</td>
                  <td className="px-2 py-1.5 text-center tabular-nums">{m.tip ?? "–"}</td>
                  <td className="py-1.5 text-center tabular-nums">
                    {m.points !== null ? m.points : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Popover>
    </>
  );
}
