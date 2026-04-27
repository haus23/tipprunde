import type { ColumnDef } from "@tanstack/react-table";

import type { Championship } from "#db/dal/championships.ts";

export function createTurnierColumns(): ColumnDef<Championship>[] {
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
