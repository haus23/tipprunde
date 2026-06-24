import { calcGoalDeviation } from "@tipprunde/domain/scoring";
import { useMemo } from "react";

import { CellFlag } from "#/components/cell-flag.tsx";
import { CellLink } from "#/components/cell-link.tsx";
import { RoundAccordion } from "#/components/round-accordion.tsx";
import { formatDate } from "#/lib/format.ts";
import type { PlayerRound } from "#/lib/spieler.ts";

export function PlayerRoundItem({
  round,
  defaultOpen,
  hasDeviationRule,
}: {
  round: PlayerRound;
  defaultOpen: boolean;
  hasDeviationRule: boolean;
}) {
  const matchesWithResult = round.matches.filter((m) => m.result !== null).length;
  const totalMatches = round.matches.length;
  const roundPoints = round.matches.reduce((sum, m) => sum + (m.tips[0]?.points ?? 0), 0);
  const roundAvg =
    round.tipsPublished && matchesWithResult > 0
      ? (roundPoints / matchesWithResult).toFixed(2)
      : null;
  const deviationSum = hasDeviationRule
    ? round.matches
        .filter((m) => m.result !== null)
        .reduce((sum, m) => sum + calcGoalDeviation(m.tips[0]?.tip ?? null, m.result!), 0)
    : null;
  const roundBonus = round.roundPoints[0]?.points ?? null;
  const roundSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;
  const meta = useMemo(
    () => (
      <span className="text-subtle flex items-center gap-2 text-xs">
        {round.tipsPublished && <span>{roundPoints} Pkt</span>}
        <span>{roundSpiele} Sp.</span>
        {roundAvg !== null && <span>Ø {roundAvg}</span>}
        {deviationSum !== null && <span>Abw. {deviationSum}</span>}
        {roundBonus !== null && (
          <span className={roundBonus > 0 ? "text-accent" : roundBonus < 0 ? "text-error" : ""}>
            {roundBonus > 0 ? `+${roundBonus}` : roundBonus < 0 ? String(roundBonus) : "±0"}
          </span>
        )}
      </span>
    ),
    [round.tipsPublished, roundPoints, roundSpiele, roundAvg, deviationSum, roundBonus],
  );

  return (
    <RoundAccordion title={`Runde ${round.nr}`} defaultOpen={defaultOpen} meta={meta}>
      <table className="w-full text-base">
        <thead>
          <tr className="border-subtle text-muted border-b text-left text-xs tracking-wide uppercase">
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-right font-medium">#</th>
            <th className="hidden w-px px-2 pt-2 pb-3 font-medium md:table-cell">Datum</th>
            <th className="xs:px-2 px-1 pt-2 pb-3 font-medium">Paarung</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Erg.</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Tipp</th>
            <th className="xs:px-2 w-px px-1 pt-2 pb-3 text-center font-medium">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {round.matches.map((match) => {
            const tip = match.tips[0];
            const showTip = round.tipsPublished && tip?.tip;
            return (
              <tr key={match.id} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle xs:px-2 w-px px-1 py-3 text-right tabular-nums">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    {match.nr}
                  </CellLink>
                </td>
                <td className="hidden w-px px-2 py-3 tabular-nums md:table-cell">
                  {match.date ? formatDate(match.date) : "–"}
                </td>
                <td className="xs:px-2 px-1 py-3">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    <span className="hidden sm:inline">
                      {match.hometeam?.name ?? "–"} – {match.awayteam?.name ?? "–"}
                    </span>
                    <span className="sm:hidden">
                      {match.hometeam?.shortName ?? "–"} – {match.awayteam?.shortName ?? "–"}
                    </span>
                  </CellLink>
                </td>
                <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                  {match.result ?? "–:–"}
                </td>
                <td className="xs:px-6 relative w-px px-3 py-3 text-center tabular-nums">
                  {showTip ? tip.tip : "–"}
                  {showTip && tip.joker && <CellFlag label="Joker-Tipp" />}
                  {showTip && tip.extraJoker && <CellFlag label="Zusatzjoker-Tipp" />}
                </td>
                <td className="xs:px-2 w-px px-1 py-3 text-center tabular-nums">
                  {tip?.points != null ? tip.points : "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </RoundAccordion>
  );
}
