import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/(ui)/button.tsx";
import { DataTable } from "@/components/(ui)/data-table.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import { fetchTeams } from "@/lib/teams.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { teams } from "#db/schema/tables.ts";
import { createTeamColumns } from "./-team-columns.tsx";
import { TeamForm } from "./-team-form.tsx";

type Team = typeof teams.$inferSelect;

interface Props {
  initialTeams: Team[];
}

export function TeamsTable({ initialTeams }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | undefined>(undefined);

  const { data: teams } = useQuery({
    queryKey: queryKeys.teams.all,
    queryFn: () => fetchTeams(),
    initialData: initialTeams,
  });

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(t: Team) {
    setEditTarget(t);
    setIsOpen(true);
  }

  const columns = useMemo(() => createTeamColumns(openEdit), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={teams}
        withFilter
        filterPlaceholder="Team suchen …"
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Team bearbeiten" : "Neues Team anlegen"}
      >
        <TeamForm key={editTarget?.id ?? "new"} team={editTarget} />
      </Dialog>
    </>
  );
}
