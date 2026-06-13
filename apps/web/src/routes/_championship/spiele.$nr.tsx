import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { formatDate } from "#/lib/format.ts";
import { matchQueryOptions } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/spiele/$nr")({
  loader: ({ context, params }) => {
    const id = context.championship?.id;
    const nr = Number(params.nr);
    if (id !== undefined && Number.isInteger(nr)) {
      return context.queryClient.ensureQueryData(matchQueryOptions(id, nr));
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

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-4 px-4">
        <Link
          to="/spiele"
          className="text-subtle hover:text-app focus-visible:ring-accent inline-flex items-center gap-1 rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
        >
          <ArrowLeftIcon className="size-4" />
          Spielübersicht
        </Link>
      </div>
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          <span className="sm:hidden">{match.paarungShort}</span>
          <span className="hidden sm:inline">{match.paarung}</span>
        </h1>
        <p className="text-subtle text-center text-sm">{meta}</p>
      </div>
    </div>
  );
}
