"use client";

import { useMemo, useState } from "react";

import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import type { Ruleset } from "#db/dal/rulesets.ts";

import { createRegelwerkColumns } from "./-regelwerk-columns.tsx";
import { RegelwerkForm } from "./-regelwerk-form.tsx";

interface Props {
  regelwerke: Ruleset[];
}

export function RegelwerkeTable({ regelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Ruleset | undefined>(undefined);

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(r: Ruleset) {
    setEditTarget(r);
    setIsOpen(true);
  }

  const columns = useMemo(() => createRegelwerkColumns(openEdit), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={regelwerke}
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Regelwerk bearbeiten" : "Neues Regelwerk anlegen"}
      >
        <RegelwerkForm key={editTarget?.id ?? "new"} regelwerk={editTarget} />
      </Dialog>
    </>
  );
}
