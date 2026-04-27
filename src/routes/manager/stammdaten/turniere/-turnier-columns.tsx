import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import { Button } from "#/components/(ui)/button.tsx";
import type { Championship } from "#db/dal/championships.ts";

export function createTurnierColumns(onEdit: (t: Championship) => void): ColumnDef<Championship>[] {
  return [
    {
      accessorKey: "nr",
      header: "#",
      meta: { className: "whitespace-nowrap" },
    },
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row.name} ${row.slug}`,
      cell: ({ row }) => row.original.name,
      meta: { className: "w-full" },
    },
    {
      id: "ruleset",
      header: "Regelwerk",
      accessorFn: (row) => row.ruleset?.name ?? "—",
      meta: { className: "hidden sm:table-cell whitespace-nowrap" },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="secondary"
            size="icon"
            onPress={() => onEdit(row.original)}
            aria-label="Bearbeiten"
          >
            <PencilIcon size={14} />
          </Button>
        </div>
      ),
    },
  ];
}
