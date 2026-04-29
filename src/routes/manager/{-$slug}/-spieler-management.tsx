"use client";

import { useRouter } from "@tanstack/react-router";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { ListBox, ListBoxItem, useDragAndDrop } from "react-aria-components";

import { addPlayerFn, removePlayerFn } from "#/app/manager/players.ts";
import { fetchUsersFn } from "#/app/manager/users.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import { SpielerForm } from "#/routes/manager/stammdaten/spieler/-spieler-form.tsx";
import type { Player } from "#db/dal/players.ts";
import type { User } from "#db/dal/users.ts";

interface Props {
  championshipId: number;
  initialPlayers: Player[];
  initialUsers: User[];
}

const DRAG_TYPE = "application/x-player-id";

export function SpielerManagement({ championshipId, initialPlayers, initialUsers }: Props) {
  const router = useRouter();
  const [isNewSpielerOpen, setIsNewSpielerOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const [tournamentUsers, setTournamentUsers] = useState<User[]>(
    () => initialPlayers.map((p) => p.user).filter(Boolean) as User[],
  );
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);

  const tournamentIdSet = new Set(tournamentUsers.map((u) => u.id));
  const availableUsers = allUsers.filter(
    (u) =>
      !tournamentIdSet.has(u.id) &&
      (filter === "" || `${u.name} ${u.slug}`.toLowerCase().includes(filter.toLowerCase())),
  );

  async function handleAdd(userId: number) {
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;
    setTournamentUsers((prev) => [...prev, user]);
    setFilter("");
    await addPlayerFn({ data: { championshipId, userId } });
    void router.invalidate();
  }

  async function handleRemove(userId: number) {
    setTournamentUsers((prev) => prev.filter((u) => u.id !== userId));
    await removePlayerFn({ data: { championshipId, userId } });
    void router.invalidate();
  }

  async function extractUserIds(
    items: Parameters<Parameters<typeof useDragAndDrop>[0]["onRootDrop"] & {}>[0]["items"],
  ) {
    const ids: number[] = [];
    for (const item of items) {
      if (item.kind === "text" && item.types.has(DRAG_TYPE)) {
        ids.push(Number(await item.getText(DRAG_TYPE)));
      }
    }
    return ids;
  }

  const { dragAndDropHooks: tournamentDnD } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    async onItemDrop({ items }) {
      for (const id of await extractUserIds(items)) void handleAdd(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserIds(items)) void handleAdd(id);
    },
  });

  const { dragAndDropHooks: availableDnD } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    async onItemDrop({ items }) {
      for (const id of await extractUserIds(items)) void handleRemove(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserIds(items)) void handleRemove(id);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium">Spieler</h2>
      <div className="bg-surface border-surface rounded-md border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Im Turnier <span className="text-subtle font-normal">({tournamentUsers.length})</span>
            </p>
            <ListBox
              aria-label="Spieler im Turnier"
              items={tournamentUsers}
              dragAndDropHooks={tournamentDnD}
              className="bg-surface border-input max-h-80 overflow-y-auto rounded-md border p-1"
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
                  className="data-focused:bg-subtle flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-dragging:opacity-40"
                >
                  {user.name}
                </ListBoxItem>
              )}
            </ListBox>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Alle Spieler</p>
            <ListBox
              aria-label="Verfügbare Spieler"
              items={availableUsers}
              dragAndDropHooks={availableDnD}
              className="bg-surface border-input h-80 overflow-y-auto rounded-md border p-1"
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
                  className="data-focused:bg-subtle flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-dragging:opacity-40"
                >
                  {user.name}
                </ListBoxItem>
              )}
            </ListBox>
            <div className="flex gap-2">
              <input
                type="search"
                placeholder="Spieler suchen …"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border-input min-w-0 flex-1 rounded-md border px-3 py-1.5 text-sm outline-none placeholder:opacity-40"
              />
              <Button
                size="icon"
                onPress={() => setIsNewSpielerOpen(true)}
                aria-label="Neuen Spieler anlegen"
              >
                <UserPlusIcon size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isNewSpielerOpen}
        onOpenChange={setIsNewSpielerOpen}
        title="Neuen Spieler anlegen"
      >
        <SpielerForm
          key={isNewSpielerOpen ? "open" : "closed"}
          onSuccess={async (name) => {
            setAllUsers(await fetchUsersFn());
            setFilter(name);
          }}
        />
      </Dialog>
    </div>
  );
}
