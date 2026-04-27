import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import { Button } from "#/components/(ui)/button.tsx";
import type { User } from "#db/dal/users.ts";

const ROLE_LABELS: Record<User["role"], string> = {
  user: "Spieler",
  manager: "Manager",
  admin: "Admin",
};

export function createSpielerColumns(onEdit: (s: User) => void): ColumnDef<User>[] {
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
      cell: ({ getValue }) => ROLE_LABELS[getValue<User["role"]>()],
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
