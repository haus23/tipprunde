import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchLeagues } from "@/lib/leagues.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { leagues } from "#db/schema/tables.ts";
import { createLigaColumns } from "./-liga-columns.tsx";
import { LigaForm } from "./-liga-form.tsx";

type Liga = typeof leagues.$inferSelect;

interface Props {
  initialLigen: Liga[];
}

export function LigenTable({ initialLigen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Liga | undefined>(undefined);

  const { data: ligen } = useQuery({
    queryKey: queryKeys.leagues.all,
    queryFn: () => fetchLeagues(),
    initialData: initialLigen,
  });

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(l: Liga) {
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
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Liga bearbeiten" : "Neue Liga anlegen"}
      >
        <LigaForm key={editTarget?.id ?? "new"} liga={editTarget} />
      </Dialog>
    </>
  );
}
