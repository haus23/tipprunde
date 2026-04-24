"use client";

import { useMemo, useState } from "react";

import type { League } from "#db/dal/leagues.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import { toastQueue } from "#/components/(ui)/toast.tsx";

import { createLigaColumns } from "./-liga-columns.tsx";
import { LigaForm } from "./-liga-form.tsx";

interface Props {
  ligen: League[];
}

export function LigenTable({ ligen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<League | undefined>(undefined);
  const [filter, setFilter] = useState("");

  function handleCreateSuccess(shortName: string) {
    setFilter(shortName);
    toastQueue.add({ title: "Liga angelegt" }, { timeout: 5000 });
  }

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(l: League) {
    setEditTarget(l);
    setIsOpen(true);
  }

  const columns = useMemo(() => createLigaColumns(openEdit), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={ligen}
        withFilter
        filterPlaceholder="Liga suchen …"
        filter={filter}
        onFilterChange={setFilter}
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Liga bearbeiten" : "Neue Liga anlegen"}
      >
        <LigaForm key={editTarget?.id ?? "new"} liga={editTarget} onSuccess={handleCreateSuccess} />
      </Dialog>
    </>
  );
}
