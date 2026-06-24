import { CellLink } from "#/components/cell-link.tsx";
import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import type { RankedPlayer } from "#/lib/ranking.ts";

export function ChampionshipStandings({
  ranking,
  completed,
  userId,
}: {
  ranking: RankedPlayer[];
  completed: boolean;
  userId: number | undefined;
}) {
  const top3 = ranking.slice(0, 3);
  const userEntry = userId !== undefined ? ranking.find((e) => e.userId === userId) : undefined;
  const userBelowTop3 =
    userEntry && !top3.some((e) => e.userId === userEntry.userId) ? userEntry : undefined;
  const hasGap = userBelowTop3 ? ranking.indexOf(userBelowTop3) > 3 : false;

  return (
    <section className="flex flex-col">
      <SectionHeading>{completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}</SectionHeading>
      <table className="w-full text-base">
        <tbody>
          {top3.map((entry, index) => {
            const sharesRankAbove = index > 0 && top3[index - 1].rank === entry.rank;
            const isUser = userId === entry.userId;
            return (
              <tr key={entry.userId} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle w-px py-2 pr-3 text-right tabular-nums">
                  {sharesRankAbove ? "" : entry.rank}
                </td>
                <td className={`py-2 ${isUser ? "text-accent" : ""}`}>
                  <CellLink to="/tipps/{-$slug}" params={{ slug: entry.slug }}>
                    {entry.name}
                  </CellLink>
                </td>
                <td className="py-2 text-right font-medium tabular-nums">{entry.total}</td>
              </tr>
            );
          })}
        </tbody>
        {userBelowTop3 && (
          <tbody>
            {hasGap && (
              <tr>
                <td colSpan={3} className="text-subtle py-1 text-center text-xs">
                  ⋮
                </td>
              </tr>
            )}
            <tr className="border-subtle border-t">
              <td className="text-subtle w-px py-2 pr-3 text-right tabular-nums">
                {userBelowTop3.rank}
              </td>
              <td className="text-accent py-2">
                <CellLink to="/tipps/{-$slug}" params={{ slug: userBelowTop3.slug }}>
                  {userBelowTop3.name}
                </CellLink>
              </td>
              <td className="py-2 text-right font-medium tabular-nums">{userBelowTop3.total}</td>
            </tr>
          </tbody>
        )}
      </table>
      <div className="mt-3 flex justify-end">
        <SectionLink to="/tabelle">Vollständige Tabelle →</SectionLink>
      </div>
    </section>
  );
}
