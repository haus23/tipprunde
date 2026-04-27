import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import { Button } from "#/components/(ui)/button.tsx";
import type { League } from "#db/dal/leagues.ts";

export function createLigaColumns(onEdit: (l: League) => void): ColumnDef<League>[] {
  return [
    {
      accessorKey: "shortName",
      header: "Kurzname",
      meta: { className: "whitespace-nowrap" },
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "w-full" },
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
