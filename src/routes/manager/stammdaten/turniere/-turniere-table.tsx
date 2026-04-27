"use client";

import { useMemo, useState } from "react";

import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import type { Championship } from "#db/dal/championships.ts";
import type { Ruleset } from "#db/dal/rulesets.ts";

import { createTurnierColumns } from "./-turnier-columns.tsx";
import { TurnierForm } from "./-turnier-form.tsx";

interface Props {
  turniere: Championship[];
  regelwerke: Ruleset[];
}

export function TurniereTable({ turniere, regelwerke }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTurnier, setEditTurnier] = useState<Championship | null>(null);
  const [filter, setFilter] = useState("");

  const nextNr = (turniere[0]?.nr ?? 0) + 1;
  const columns = useMemo(() => createTurnierColumns(setEditTurnier), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={turniere}
        withFilter
        filterPlaceholder="Turnier suchen …"
        filter={filter}
        onFilterChange={setFilter}
        toolbar={<Button onPress={() => setIsCreateOpen(true)}>Neu anlegen</Button>}
      />

      <Dialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} title="Neues Turnier anlegen">
        <TurnierForm
          key={isCreateOpen ? "open" : "closed"}
          regelwerke={regelwerke}
          nextNr={nextNr}
        />
      </Dialog>

      {editTurnier && (
        <Dialog
          isOpen
          onOpenChange={(open) => !open && setEditTurnier(null)}
          title="Turnier bearbeiten"
        >
          <TurnierForm key={editTurnier.id} regelwerke={regelwerke} turnier={editTurnier} />
        </Dialog>
      )}
    </>
  );
}
