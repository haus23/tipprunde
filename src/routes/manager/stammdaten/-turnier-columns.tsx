import type { ColumnDef } from "@tanstack/react-table";
import type { championships, rulesets } from "#db/schema/tables.ts";

type Turnier = typeof championships.$inferSelect & {
  ruleset: typeof rulesets.$inferSelect | null;
};

export function createTurnierColumns(): ColumnDef<Turnier>[] {
  return [
    {
      accessorKey: "nr",
      header: "#",
      meta: { className: "whitespace-nowrap" },
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "w-full" },
    },
    {
      id: "ruleset",
      header: "Regelwerk",
      accessorFn: (row) => row.ruleset?.name ?? "—",
      meta: { className: "hidden sm:table-cell whitespace-nowrap" },
    },
  ];
}
