import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { TipFlag } from "#/components/tip-flag.tsx";
import { formatDate } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { matchQueryOptions } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/spiele/$nr")({
  loader: ({ context, params }) => {
    const id = context.championship?.id;
    const nr = Number(params.nr);
    if (id !== undefined && Number.isInteger(nr)) {
      return Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(matchQueryOptions(id, nr)),
      ]);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();
  const { nr } = Route.useParams();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <MatchView championshipId={championship.id} nr={Number(nr)} />;
}

function MatchView({ championshipId, nr }: { championshipId: number; nr: number }) {
  const {
    data: { match },
  } = useSuspenseQuery(matchQueryOptions(championshipId, nr));
  const {
    data: { ranking },
  } = useSuspenseQuery(rankingQueryOptions(championshipId));

  if (!match) {
    return (
      <div className="mx-auto w-full max-w-5xl py-8">
        <p className="text-subtle py-16 text-center text-base">Spiel nicht gefunden.</p>
      </div>
    );
  }

  const meta = [
    match.date ? formatDate(match.date) : null,
    match.liga,
    match.result ? `Ergebnis ${match.result}` : null,
    match.points !== null ? `${match.points} Pkt` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const tipsByUser = new Map(match.tips.map((t) => [t.userId, t]));

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-4 flex items-center justify-between px-4">
        <Link
          to="/spiele"
          className="text-subtle hover:text-app focus-visible:ring-accent inline-flex items-center gap-1 rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
        >
          <ArrowLeftIcon className="size-4" />
          Spielübersicht
        </Link>
        <div className="flex items-center gap-1">
          {match.prevNr !== null && (
            <Link
              to="/spiele/$nr"
              params={{ nr: String(match.prevNr) }}
              aria-label="Vorheriges Spiel"
              className="text-subtle hover:bg-nav-active hover:text-app focus-visible:ring-accent flex size-7 items-center justify-center rounded-sm transition ease-out outline-none focus-visible:ring-2"
            >
              <ChevronLeftIcon className="size-4" />
            </Link>
          )}
          {match.nextNr !== null && (
            <Link
              to="/spiele/$nr"
              params={{ nr: String(match.nextNr) }}
              aria-label="Nächstes Spiel"
              className="text-subtle hover:bg-nav-active hover:text-app focus-visible:ring-accent flex size-7 items-center justify-center rounded-sm transition ease-out outline-none focus-visible:ring-2"
            >
              <ChevronRightIcon className="size-4" />
            </Link>
          )}
        </div>
      </div>
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          <span className="sm:hidden">{match.paarungShort}</span>
          <span className="hidden sm:inline">{match.paarung}</span>
        </h1>
        <p className="text-subtle text-center text-sm">{meta}</p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <table className="w-full text-base">
          <thead>
            <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
              <th className="xs:px-3 px-2 pt-2 pb-3 font-medium">Spieler</th>
              {match.tipsPublished && (
                <th className="xs:px-3 w-px px-2 pt-2 pb-3 text-center font-medium">Tipp</th>
              )}
              {match.tipsPublished && (
                <th className="xs:px-3 w-px px-2 pt-2 pb-3 text-right font-medium">Pkt</th>
              )}
            </tr>
          </thead>
          <tbody>
            {ranking.map((p) => {
              const tip = tipsByUser.get(p.userId);
              return (
                <tr key={p.userId} className="border-subtle border-b last:border-b-0">
                  <td className="xs:px-3 px-2 py-3 font-medium">{p.name}</td>
                  {match.tipsPublished && (
                    <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                      {tip?.tip ?? "–"}
                      {tip?.joker && <TipFlag label="Joker-Tipp" />}
                    </td>
                  )}
                  {match.tipsPublished && (
                    <td className="xs:px-3 w-px px-2 py-3 text-right tabular-nums">
                      {tip?.points ?? "–"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
