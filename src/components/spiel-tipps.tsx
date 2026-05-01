"use client";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { TipFlag } from "#/components/tip-flag.tsx";

type SortCol = "name" | "tip" | "points";
type SortState = { col: SortCol; dir: "asc" | "desc" } | null;

export interface TipRow {
  rank: number;
  userId: number;
  userName: string;
  tip: string | null;
  points: number | null;
  joker: boolean | null;
}

interface Props {
  tips: TipRow[];
  tipsPublished: boolean;
}

function parseTip(tip: string | null): [number, number, number] {
  if (!tip) return [99, 99, 99];
  const [h, a] = tip.split(":").map(Number);
  if (isNaN(h) || isNaN(a)) return [99, 99, 99];
  const outcome = h > a ? 0 : h === a ? 1 : 2;
  return [outcome, h, a];
}

function SortIcon({ col, sort }: { col: SortCol; sort: SortState }) {
  if (sort?.col !== col) return <ArrowUpDownIcon size={12} className="text-subtle/50" />;
  return sort.dir === "asc" ? (
    <ArrowUpIcon size={12} className="text-subtle" />
  ) : (
    <ArrowDownIcon size={12} className="text-subtle" />
  );
}

export function SpielTipps({ tips, tipsPublished }: Props) {
  const [sort, setSort] = useState<SortState>(null);

  function handleSort(col: SortCol) {
    setSort((prev) => {
      if (prev?.col !== col) return { col, dir: "asc" };
      if (prev.dir === "asc") return { col, dir: "desc" };
      return null;
    });
  }

  const sorted = useMemo(() => {
    if (!sort) return tips;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...tips].sort((a, b) => {
      if (sort.col === "name") return factor * a.userName.localeCompare(b.userName, "de");
      if (sort.col === "points") {
        return factor * ((a.points ?? -1) - (b.points ?? -1));
      }
      const [ao, ah, aa] = parseTip(a.tip);
      const [bo, bh, ba] = parseTip(b.tip);
      return factor * (ao - bo || bh - ba - (ah - aa) || ah - bh);
    });
  }, [tips, sort]);

  return (
    <div className="bg-surface border-surface xs:rounded-md xs:border border-y px-4 py-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="text-subtle w-px pt-2 pr-3 pb-3 text-right text-xs font-medium tracking-wide uppercase">
              Platz
            </th>
            <th className="text-subtle pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
              <button
                onClick={() => handleSort("name")}
                className="focus-visible:ring-focus flex items-center gap-1 rounded uppercase transition-transform outline-none focus-visible:ring-2 active:scale-[0.97]"
              >
                Spieler
                <SortIcon col="name" sort={sort} />
              </button>
            </th>
            {tipsPublished && (
              <>
                <th className="text-subtle w-px pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                  <button
                    onClick={() => handleSort("tip")}
                    className="focus-visible:ring-focus mx-auto flex items-center gap-1 rounded uppercase transition-transform outline-none focus-visible:ring-2 active:scale-[0.97]"
                  >
                    Tipp
                    <SortIcon col="tip" sort={sort} />
                  </button>
                </th>
                <th className="text-subtle w-px pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                  <button
                    onClick={() => handleSort("points")}
                    className="focus-visible:ring-focus mx-auto flex items-center gap-1 rounded uppercase transition-transform outline-none focus-visible:ring-2 active:scale-[0.97]"
                  >
                    Pkt
                    <SortIcon col="points" sort={sort} />
                  </button>
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((tip) => (
            <tr key={tip.userId} className="border-input border-b last:border-b-0">
              <td className="w-px py-3 pr-3 text-right tabular-nums">{tip.rank}</td>
              <td className="py-3">{tip.userName}</td>
              {tipsPublished && (
                <>
                  <td className="relative w-px px-6 py-3 text-center tabular-nums">
                    {tip.tip ?? "–"}
                    {tip.joker && <TipFlag label="Joker-Tipp" />}
                  </td>
                  <td className="w-px px-2 py-3 text-center tabular-nums">{tip.points ?? "–"}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
