import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ListBox, ListBoxItem, useDragAndDrop } from "react-aria-components";

import type { Player } from "#db/dal/players.ts";
import type { User } from "#db/dal/users.ts";
import { Button } from "@/components/(ui)/button.tsx";
import { Dialog } from "@/components/(ui)/dialog.tsx";
import {
  addTurnierSpieler,
  fetchTurnierSpieler,
  removeTurnierSpieler,
} from "@/lib/participants.ts";
import { fetchPlayers } from "@/lib/players.ts";
import { queryClient } from "@/lib/query-client.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import { SpielerForm } from "@/routes/manager/stammdaten/-spieler-form.tsx";

type TournamentPlayer = Player;

interface Props {
  championshipId: number;
  initialPlayers: TournamentPlayer[];
  initialUsers: User[];
}

const DRAG_TYPE = "application/x-player-id";

export function SpielerManagement({ championshipId, initialPlayers, initialUsers }: Props) {
  const [filter, setFilter] = useState("");
  const [isNewSpielerOpen, setIsNewSpielerOpen] = useState(false);

  const { data: allUsers } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => fetchPlayers(),
    initialData: initialUsers,
  });

  const { data: tournamentPlayers } = useQuery({
    queryKey: queryKeys.players.byChampionship(championshipId),
    queryFn: () => fetchTurnierSpieler({ data: championshipId }),
    initialData: initialPlayers,
    select: (data) => data.map((p) => p.user).filter(Boolean) as User[],
  });

  const tournamentUserIdSet = new Set(tournamentPlayers.map((u) => u.id));

  const availablePlayers = allUsers.filter(
    (u) =>
      !tournamentUserIdSet.has(u.id) &&
      (filter === "" || u.name.toLowerCase().includes(filter.toLowerCase())),
  );

  const addMutation = useMutation({
    mutationFn: (userId: number) => addTurnierSpieler({ data: { championshipId, userId } }),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.players.byChampionship(championshipId),
      });
      const previous = queryClient.getQueryData<TournamentPlayer[]>(
        queryKeys.players.byChampionship(championshipId),
      );
      const user = allUsers.find((u) => u.id === userId);
      if (user) {
        queryClient.setQueryData<TournamentPlayer[]>(
          queryKeys.players.byChampionship(championshipId),
          (old = []) => [
            ...old,
            { id: old.length + 1, championshipId, userId, nr: old.length + 1, user },
          ],
        );
      }
      return { previous };
    },
    onError: (_err, _userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.players.byChampionship(championshipId),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.players.byChampionship(championshipId),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (userId: number) => removeTurnierSpieler({ data: { championshipId, userId } }),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.players.byChampionship(championshipId),
      });
      const previous = queryClient.getQueryData<TournamentPlayer[]>(
        queryKeys.players.byChampionship(championshipId),
      );
      queryClient.setQueryData<TournamentPlayer[]>(
        queryKeys.players.byChampionship(championshipId),
        (old = []) => old.filter((p) => p.userId !== userId),
      );
      return { previous };
    },
    onError: (_err, _userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.players.byChampionship(championshipId),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.players.byChampionship(championshipId),
      });
    },
  });

  async function extractUserId(
    items: Parameters<Parameters<typeof useDragAndDrop>[0]["onRootDrop"] & {}>[0]["items"],
  ) {
    const results: number[] = [];
    for (const item of items) {
      if (item.kind === "text" && item.types.has(DRAG_TYPE)) {
        results.push(Number(await item.getText(DRAG_TYPE)));
      }
    }
    return results;
  }

  const { dragAndDropHooks: tournamentDnD } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    async onItemDrop({ items }) {
      for (const id of await extractUserId(items)) addMutation.mutate(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserId(items)) addMutation.mutate(id);
    },
  });

  const { dragAndDropHooks: availableDnD } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    async onItemDrop({ items }) {
      for (const id of await extractUserId(items)) removeMutation.mutate(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserId(items)) removeMutation.mutate(id);
    },
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Im Turnier <span className="text-subtle font-normal">({tournamentPlayers.length})</span>
          </p>
          <ListBox
            aria-label="Spieler im Turnier"
            items={tournamentPlayers}
            dragAndDropHooks={tournamentDnD}
            className="bg-surface border-surface min-h-48 rounded-md border p-1"
            renderEmptyState={() => (
              <p className="text-subtle p-6 text-center text-sm">
                Spieler von rechts hierher ziehen
              </p>
            )}
          >
            {(user) => (
              <ListBoxItem
                id={user.id}
                textValue={user.name}
                className="data-[focused]:bg-subtle flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-[dragging]:opacity-40"
              >
                {user.name}
              </ListBoxItem>
            )}
          </ListBox>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Alle Spieler</p>
            <Button onPress={() => setIsNewSpielerOpen(true)}>Neuer Spieler</Button>
          </div>
          <input
            type="search"
            placeholder="Spieler suchen …"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-input rounded-md border px-3 py-1.5 text-sm outline-none placeholder:opacity-40"
          />
          <ListBox
            aria-label="Verfügbare Spieler"
            items={availablePlayers}
            dragAndDropHooks={availableDnD}
            className="bg-surface border-surface min-h-48 rounded-md border p-1"
            renderEmptyState={() => (
              <p className="text-subtle p-6 text-center text-sm">
                {filter ? "Keine Treffer" : "Alle Spieler sind im Turnier"}
              </p>
            )}
          >
            {(user) => (
              <ListBoxItem
                id={user.id}
                textValue={user.name}
                className="data-[focused]:bg-subtle flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-[dragging]:opacity-40"
              >
                {user.name}
              </ListBoxItem>
            )}
          </ListBox>
        </div>
      </div>

      <Dialog
        isOpen={isNewSpielerOpen}
        onOpenChange={setIsNewSpielerOpen}
        title="Neuen Spieler anlegen"
      >
        <SpielerForm key={isNewSpielerOpen ? "open" : "closed"} />
      </Dialog>
    </>
  );
}
