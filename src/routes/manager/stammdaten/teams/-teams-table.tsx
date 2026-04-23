"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { Team } from "#db/dal/teams.ts";
import { fetchTeamsFn } from "#/app/manager/teams.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import { toastQueue } from "#/components/(ui)/toast.tsx";
import { queryKeys } from "#/utils/query-keys.ts";

import { createTeamColumns } from "./-team-columns.tsx";
import { TeamForm } from "./-team-form.tsx";

interface Props {
  initialTeams: Team[];
}

export function TeamsTable({ initialTeams }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | undefined>(undefined);
  const [filter, setFilter] = useState("");

  const { data: teams } = useQuery({
    queryKey: queryKeys.teams.all,
    queryFn: () => fetchTeamsFn(),
    initialData: initialTeams,
  });

  function handleCreateSuccess(shortName: string) {
    setFilter(shortName);
    toastQueue.add({ title: "Team angelegt" }, { timeout: 5000 });
  }

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
        filter={filter}
        onFilterChange={setFilter}
        toolbar={<Button onPress={openCreate}>Neu anlegen</Button>}
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Team bearbeiten" : "Neues Team anlegen"}
      >
        <TeamForm key={editTarget?.id ?? "new"} team={editTarget} onSuccess={handleCreateSuccess} />
      </Dialog>
    </>
  );
}
