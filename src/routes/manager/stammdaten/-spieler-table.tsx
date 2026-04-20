import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { User } from "#db/dal/users.ts";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchPlayers } from "@/lib/players.ts";
import { queryKeys } from "@/lib/query-keys.ts";

import { createSpielerColumns } from "./-spieler-columns.tsx";
import { SpielerForm } from "./-spieler-form.tsx";

type Spieler = User;

interface Props {
  initialSpieler: Spieler[];
}

export function SpielerTable({ initialSpieler }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Spieler | undefined>(undefined);

  const { data: spieler } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => fetchPlayers(),
    initialData: initialSpieler,
  });

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(s: Spieler) {
    setEditTarget(s);
    setIsOpen(true);
  }

  const columns = useMemo(() => createSpielerColumns(openEdit), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={spieler}
        withFilter
        filterPlaceholder="Spieler suchen …"
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Spieler bearbeiten" : "Neuen Spieler anlegen"}
      >
        <SpielerForm key={editTarget?.id ?? "new"} spieler={editTarget} />
      </Dialog>
    </>
  );
}
