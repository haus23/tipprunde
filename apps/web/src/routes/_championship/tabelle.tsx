import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PlayerLink } from "#/components/player-link.tsx";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";
import type { SessionUser } from "#/lib/session.ts";

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
  const {
    data: { ranking, showExtras },
  } = useSuspenseQuery(rankingQueryOptions(championship.id));

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
        <RankingTable ranking={ranking} showExtras={showExtras} currentUserId={user?.id} />
      )}
    </div>
  );
}

function RankingTable({
  ranking,
  showExtras,
  currentUserId,
}: {
  ranking: RankedPlayer[];
  showExtras: boolean;
  currentUserId: number | undefined;
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
                <PlayerLink slug={entry.slug}>{entry.name}</PlayerLink>
              </td>
              {showExtras && (
                <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-center tabular-nums">
                  {entry.extraPoints}
                </td>
              )}
              <td className="xs:px-3 xs:py-3 px-2 py-2 text-center font-medium tabular-nums">
                {entry.total}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
