import type { ColumnDef } from "@tanstack/react-table";

import type { Championship } from "#db/dal/championships.ts";

type Turnier = Championship;

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
