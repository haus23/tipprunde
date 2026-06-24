import { CellLink } from "#/components/cell-link.tsx";
import type { ArchivEntry } from "#/lib/archiv.ts";

import { SectionHeading } from "./-section-heading.tsx";
import { SectionLink } from "./-section-link.tsx";

export function ChampionshipArchivPreview({ championships }: { championships: ArchivEntry[] }) {
  return (
    <section>
      <SectionHeading>Archiv</SectionHeading>
      <table className="w-full text-base">
        <thead>
          <tr className="text-muted border-subtle border-b text-xs tracking-wide uppercase">
            <th className="pb-1.5 text-left font-medium">Turnier</th>
            <th className="pr-3 pb-1.5 text-left font-medium">Sieger</th>
            <th className="pb-1.5 text-right font-medium">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {championships.map((entry) => (
            <tr key={entry.slug} className="border-subtle border-b last:border-b-0">
              <td className="text-subtle py-2 pr-3 text-sm">
                <CellLink to="/archiv/$slug" params={{ slug: entry.slug }}>
                  {entry.name}
                </CellLink>
              </td>
              <td className="py-2 pr-3">
                {entry.winners.map((w, i) => (
                  <span key={w.slug}>
                    {i > 0 && ", "}
                    {w.name}
                  </span>
                ))}
              </td>
              <td className="py-2 text-right font-medium tabular-nums">
                {entry.winners[0]?.total ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex justify-end">
        <SectionLink to="/archiv">Komplettes Archiv →</SectionLink>
      </div>
    </section>
  );
}
