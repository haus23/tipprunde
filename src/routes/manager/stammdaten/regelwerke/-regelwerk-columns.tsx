import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import { Button } from "#/components/(ui)/button.tsx";
import type { Ruleset } from "#db/dal/rulesets.ts";

export function createRegelwerkColumns(onEdit: (r: Ruleset) => void): ColumnDef<Ruleset>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "whitespace-nowrap" },
    },
    {
      accessorKey: "description",
      header: "Beschreibung",
      meta: { className: "w-full max-w-0 truncate" },
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
