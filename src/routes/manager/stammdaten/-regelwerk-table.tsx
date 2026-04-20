import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchRulesets } from "@/lib/rulesets.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { rulesets } from "#db/schema/tables.ts";
import { createRegelwerkColumns } from "./-regelwerk-columns.tsx";
import { RegelwerkForm } from "./-regelwerk-form.tsx";

type Regelwerk = typeof rulesets.$inferSelect;

interface Props {
  initialRegelwerke: Regelwerk[];
}

export function RegelwerkeTable({ initialRegelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Regelwerk | undefined>(undefined);

  const { data: regelwerke } = useQuery({
    queryKey: queryKeys.rulesets.all,
    queryFn: () => fetchRulesets(),
    initialData: initialRegelwerke,
  });

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
