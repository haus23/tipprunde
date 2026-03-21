import { useMemo, useState } from "react";
import { ListBox, ListBoxItem, useDragAndDrop } from "react-aria-components";
import { addTurnierSpieler, removeTurnierSpieler } from "@/lib/participants.ts";
import type { players, users } from "@/lib/db/schema.ts";

type TournamentPlayer = typeof players.$inferSelect & {
  user: typeof users.$inferSelect | null;
};
type User = typeof users.$inferSelect;

interface Props {
  championshipId: number;
  initialPlayers: TournamentPlayer[];
  allUsers: User[];
}

const DRAG_TYPE = "application/x-player-id";

export function SpielerManagement({ championshipId, initialPlayers, allUsers }: Props) {
  const [tournamentUserIds, setTournamentUserIds] = useState(
    () => new Set(initialPlayers.map((p) => p.userId)),
  );
  const [filter, setFilter] = useState("");

  const tournamentPlayers = useMemo(
    () => allUsers.filter((u) => tournamentUserIds.has(u.id)),
    [allUsers, tournamentUserIds],
  );

  const availablePlayers = useMemo(
    () =>
      allUsers.filter(
        (u) =>
          !tournamentUserIds.has(u.id) &&
          (filter === "" || u.name.toLowerCase().includes(filter.toLowerCase())),
      ),
    [allUsers, tournamentUserIds, filter],
  );

  async function handleAdd(userId: number) {
    setTournamentUserIds((prev) => new Set([...prev, userId]));
    await addTurnierSpieler({ data: { championshipId, userId } });
  }

  async function handleRemove(userId: number) {
    setTournamentUserIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
    await removeTurnierSpieler({ data: { championshipId, userId } });
  }

  async function extractUserId(items: Parameters<Parameters<typeof useDragAndDrop>[0]["onRootDrop"] & {}>[0]["items"]) {
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
      for (const id of await extractUserId(items)) handleAdd(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserId(items)) handleAdd(id);
    },
  });

  const { dragAndDropHooks: availableDnD } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    async onItemDrop({ items }) {
      for (const id of await extractUserId(items)) handleRemove(id);
    },
    async onRootDrop({ items }) {
      for (const id of await extractUserId(items)) handleRemove(id);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          Im Turnier{" "}
          <span className="text-subtle font-normal">({tournamentPlayers.length})</span>
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
              className="flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-[dragging]:opacity-40 data-[focused]:bg-subtle"
            >
              {user.name}
            </ListBoxItem>
          )}
        </ListBox>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Alle Spieler</p>
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
              className="flex cursor-grab items-center rounded px-3 py-1.5 text-sm outline-none data-[dragging]:opacity-40 data-[focused]:bg-subtle"
            >
              {user.name}
            </ListBoxItem>
          )}
        </ListBox>
      </div>
    </div>
  );
}
