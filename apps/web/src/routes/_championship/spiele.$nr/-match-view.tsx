import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { cx } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { CellFlag } from "#/components/cell-flag.tsx";
import { CellLink } from "#/components/cell-link.tsx";
import { formatDate } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import { matchQueryOptions, roundsQueryOptions } from "#/lib/spiele.ts";

import { MatchSwitch } from "./-match-switch.tsx";
import { type SortCol, type SortDir, SortableTh } from "./-sortable-th.tsx";

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

type TipRow = {
  userId: number;
  name: string;
  slug: string;
  tip: string | null;
  points: number | null;
  joker: boolean | null;
  extraJoker: boolean | null;
};

/** "2:1" → [2, 1]; non-numeric parts sort last (99). */
function parseTip(tip: string): [number, number] {
  const [h, a] = tip.split(":").map(Number);
  return [Number.isNaN(h) ? 99 : h, Number.isNaN(a) ? 99 : a];
}

/** Tip-less / point-less rows always sink to the bottom, regardless of direction. */
function sortRows(rows: TipRow[], col: SortCol, dir: SortDir): TipRow[] {
  const factor = dir === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => {
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

export function MatchView({ championshipId, nr }: { championshipId: number; nr: number }) {
  const {
    data: { match },
  } = useSuspenseQuery(matchQueryOptions(championshipId, nr));
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championshipId));
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
      extraJoker: t?.extraJoker ?? null,
    };
  });
  const sortedRows = sortCol ? sortRows(rows, sortCol, sortDir) : rows;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="xs:px-0 relative flex flex-col items-center gap-2 px-4 md:mb-6">
        <Link to="/spiele" className={cx(navLinkClass, "mb-1 self-auto text-xs")}>
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
              className={cx(navLinkClass, "xs:ml-4 pointer-events-auto text-sm")}
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
              className={cx(navLinkClass, "xs:mr-4 pointer-events-auto text-sm")}
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
                  <CellLink to="/tipps/{-$slug}" params={{ slug: row.slug }}>
                    {row.name}
                  </CellLink>
                </td>
                {match.tipsPublished && (
                  <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                    {row.tip ?? "–"}
                    {row.joker && <CellFlag label="Joker-Tipp" />}
                    {row.extraJoker && <CellFlag label="Zusatzjoker-Tipp" />}
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
