import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { championships, rulesets } from "#db/schema/tables.ts";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchChampionshipsFn } from "#/app/manager/championships.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import { fetchRulesetsFn } from "#/app/manager/rulesets.ts";

import { createTurnierColumns } from "./-turnier-columns.tsx";
import { TurnierForm } from "./-turnier-form.tsx";

type Turnier = typeof championships.$inferSelect & {
  ruleset: typeof rulesets.$inferSelect | null;
};

interface Props {
  initialTurniere: Turnier[];
  initialRegelwerke: (typeof rulesets.$inferSelect)[];
}

export function TurniereTable({ initialTurniere, initialRegelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: turniere } = useQuery({
    queryKey: queryKeys.turniere.all,
    queryFn: () => fetchChampionshipsFn(),
    initialData: initialTurniere,
  });

  const { data: regelwerke } = useQuery({
    queryKey: queryKeys.rulesets.all,
    queryFn: () => fetchRulesetsFn(),
    initialData: initialRegelwerke,
  });

  const nextNr = (turniere[0]?.nr ?? 0) + 1;
  const columns = useMemo(() => createTurnierColumns(), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={turniere}
        toolbar={<Button onPress={() => setIsOpen(true)}>Neu anlegen</Button>}
      />

      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Neues Turnier anlegen">
        <TurnierForm key={isOpen ? "open" : "closed"} regelwerke={regelwerke} nextNr={nextNr} />
      </Dialog>
    </>
  );
}
