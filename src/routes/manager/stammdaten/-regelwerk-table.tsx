import { useMemo, useState } from "react";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import type { rulesets } from "@/lib/db/schema.ts";
import { createRegelwerkColumns } from "./-regelwerk-columns.tsx";
import { RegelwerkForm } from "./-regelwerk-form.tsx";

type Regelwerk = typeof rulesets.$inferSelect;

interface Props {
  regelwerke: Regelwerk[];
}

export function RegelwerkeTable({ regelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Regelwerk | undefined>(undefined);

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(r: Regelwerk) {
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
