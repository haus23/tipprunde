import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/(ui)/button.tsx";
import type { teams } from "#db/schema/tables.ts";

type Team = typeof teams.$inferSelect;

export function createTeamColumns(onEdit: (t: Team) => void): ColumnDef<Team>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "w-full" },
    },
    {
      accessorKey: "shortName",
      header: "Kurzname",
      meta: { className: "whitespace-nowrap" },
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
