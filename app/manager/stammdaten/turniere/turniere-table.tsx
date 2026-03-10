import Link from "next/link";
import type { championships, rulesets } from "@/lib/db/schema";

type Turnier = typeof championships.$inferSelect & {
  ruleset: typeof rulesets.$inferSelect | null;
};

interface Props {
  turniere: Turnier[];
}

export function TurniereTable({ turniere }: Props) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-medium">Turniere</h1>
        <Link
          href="/manager/turnier/neu"
          className="bg-btn text-btn data-hovered:bg-btn-hovered inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Neu anlegen
        </Link>
      </div>

      <table className="w-full text-sm [border-spacing:0]">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="py-2 pl-4 pr-2 font-medium">#</th>
            <th className="w-full px-2 py-2 font-medium">Name</th>
            <th className="hidden px-2 py-2 font-medium sm:table-cell">Regelwerk</th>
          </tr>
        </thead>
        <tbody>
          {turniere.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle px-4 py-6 text-center text-sm">
                Keine Turniere vorhanden.
              </td>
            </tr>
          ) : (
            turniere.map((t) => (
              <tr key={t.id} className="border-input border-b">
                <td className="py-2 pl-4 pr-2">{t.nr}</td>
                <td className="px-2 py-2">{t.name}</td>
                <td className="hidden px-2 py-2 sm:table-cell">{t.ruleset?.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
