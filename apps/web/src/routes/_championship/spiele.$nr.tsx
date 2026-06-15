import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useState } from "react";

import { CellLink } from "#/components/cell-link.tsx";
import { MatchSwitch } from "#/components/match-switch.tsx";
import { TipFlag } from "#/components/tip-flag.tsx";
import { formatDate } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { matchQueryOptions, roundsQueryOptions } from "#/lib/spiele.ts";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

export const Route = createFileRoute("/_championship/spiele/$nr")({
  loader: ({ context, params }) => {
    const id = context.championship?.id;
    const nr = Number(params.nr);
    if (id !== undefined && Number.isInteger(nr)) {
      return Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(roundsQueryOptions(id)),
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
      <div className="mx-auto w-full max-w-4xl py-8">
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
  const {
    data: { rounds },
  } = useSuspenseQuery(roundsQueryOptions(championshipId));
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  if (!match) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
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

  function handleSort(col: SortCol) {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortCol(null); // third click → back to ranking order
    }
  }

  const tipsByUser = new Map(match.tips.map((t) => [t.userId, t]));
  const rows: TipRow[] = ranking.map((p) => {
    const t = tipsByUser.get(p.userId);
    return {
      userId: p.userId,
      name: p.name,
      slug: p.slug,
      tip: t?.tip ?? null,
      points: t?.points ?? null,
      joker: t?.joker ?? null,
    };
  });
  const sortedRows = sortCol ? sortRows(rows, sortCol, sortDir) : rows;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="xs:px-0 relative flex flex-col items-center gap-2 px-4 md:mb-6">
        <Link to="/spiele" className={`${navLinkClass} mb-1 self-auto text-xs`}>
          <ChevronLeftIcon className="size-3" />
          Spielübersicht
        </Link>
        <div className="flex items-center gap-1.5">
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            <span className="sm:hidden">{match.paarungShort}</span>
            <span className="hidden sm:inline">{match.paarung}</span>
          </h1>
          <MatchSwitch rounds={rounds} currentNr={match.nr} />
        </div>
        <p className="text-subtle text-center text-sm">{meta}</p>
        <div className="xs:px-0 mt-2 mb-4 flex w-full justify-between md:pointer-events-none md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:mb-0 md:-translate-y-1/2">
          {match.prevNr !== null ? (
            <Link
              to="/spiele/$nr"
              params={{ nr: String(match.prevNr) }}
              className={`${navLinkClass} xs:ml-4 pointer-events-auto text-sm`}
            >
              <ChevronLeftIcon className="size-4" />
              Vorheriges
            </Link>
          ) : (
            <span />
          )}
          {match.nextNr !== null && (
            <Link
              to="/spiele/$nr"
              params={{ nr: String(match.nextNr) }}
              className={`${navLinkClass} xs:mr-4 pointer-events-auto text-sm`}
            >
              Nächstes
              <ChevronRightIcon className="size-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <table className="w-full text-base">
          <thead>
            <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
              <SortableTh
                col="name"
                label="Spieler"
                align="left"
                sortCol={sortCol}
                sortDir={sortDir}
                onSort={handleSort}
              />
              {match.tipsPublished && (
                <SortableTh
                  col="tip"
                  label="Tipp"
                  align="center"
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              )}
              {match.tipsPublished && (
                <SortableTh
                  col="points"
                  label="Pkt"
                  align="center"
                  sortCol={sortCol}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              )}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.userId} className="border-subtle border-b last:border-b-0">
                <td className="xs:px-3 px-2 py-3 font-medium">
                  <CellLink to="/spieler/{-$slug}" params={{ slug: row.slug }}>
                    {row.name}
                  </CellLink>
                </td>
                {match.tipsPublished && (
                  <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                    {row.tip ?? "–"}
                    {row.joker && <TipFlag label="Joker-Tipp" />}
                  </td>
                )}
                {match.tipsPublished && (
                  <td className="xs:px-3 w-px px-2 py-3 text-center tabular-nums">
                    {row.points ?? "–"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type SortCol = "name" | "tip" | "points";
type SortDir = "asc" | "desc";

type TipRow = {
  userId: number;
  name: string;
  slug: string;
  tip: string | null;
  points: number | null;
  joker: boolean | null;
};

/** "2:1" → [2, 1]; non-numeric parts sort last (99). */
function parseTip(tip: string): [number, number] {
  const [h, a] = tip.split(":").map(Number);
  return [Number.isNaN(h) ? 99 : h, Number.isNaN(a) ? 99 : a];
}

/** Tip-less / point-less rows always sink to the bottom, regardless of direction. */
function sortRows(rows: TipRow[], col: SortCol, dir: SortDir): TipRow[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (col === "name") return factor * a.name.localeCompare(b.name, "de");
    if (col === "points") {
      if (a.points === null && b.points === null) return 0;
      if (a.points === null) return 1;
      if (b.points === null) return -1;
      return factor * (b.points - a.points);
    }
    if (a.tip === null && b.tip === null) return 0;
    if (a.tip === null) return 1;
    if (b.tip === null) return -1;
    const [ah, aa] = parseTip(a.tip);
    const [bh, ba] = parseTip(b.tip);
    return factor * (bh - ba - (ah - aa) || bh - ah);
  });
}

function SortableTh({
  col,
  label,
  align,
  sortCol,
  sortDir,
  onSort,
}: {
  col: SortCol;
  label: string;
  align: "left" | "center";
  sortCol: SortCol | null;
  sortDir: SortDir;
  onSort: (col: SortCol) => void;
}) {
  const active = sortCol === col;
  const Icon = !active ? ArrowUpDownIcon : sortDir === "asc" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <th
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      className={`xs:px-3 px-2 pt-2 pb-3 font-medium ${align === "center" ? "w-px text-center" : ""}`}
    >
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`hover:text-app focus-visible:ring-accent inline-flex items-center gap-1 rounded-sm transition-colors outline-none focus-visible:ring-2 ${active ? "text-app" : ""}`}
      >
        {label}
        <Icon className={active ? "text-accent size-3" : "text-muted/50 size-3"} />
      </button>
    </th>
  );
}
