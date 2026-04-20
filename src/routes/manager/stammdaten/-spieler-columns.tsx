import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import type { User } from "#db/dal/users.ts";
import { Button } from "@/components/(ui)/button.tsx";

type Spieler = User;

const ROLE_LABELS: Record<Spieler["role"], string> = {
  user: "Spieler",
  manager: "Manager",
  admin: "Admin",
};

export function createSpielerColumns(onEdit: (s: Spieler) => void): ColumnDef<Spieler>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "w-full" },
    },
    {
      accessorKey: "email",
      header: "E-Mail",
      cell: ({ getValue }) => getValue<string | null>() ?? "—",
      meta: { className: "hidden sm:table-cell whitespace-nowrap" },
    },
    {
      accessorKey: "role",
      header: "Rolle",
      cell: ({ getValue }) => ROLE_LABELS[getValue<Spieler["role"]>()],
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
