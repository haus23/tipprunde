"use client";

import { useMemo, useState } from "react";

import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import type { User } from "#db/dal/users.ts";

import { createSpielerColumns } from "./-spieler-columns.tsx";
import { SpielerForm } from "./-spieler-form.tsx";

interface Props {
  spieler: User[];
}

export function SpielerTable({ spieler }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | undefined>(undefined);
  const [filter, setFilter] = useState("");

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(s: User) {
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
        filter={filter}
        onFilterChange={setFilter}
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
