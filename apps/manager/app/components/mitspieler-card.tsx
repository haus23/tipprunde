import { useMemo, useState } from "react";
import { ListBox, ListBoxItem, useDragAndDrop } from "react-aria-components";
import { useFetcher } from "react-router";

import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "./card";

type User = {
  id: number;
  name: string;
  slug: string;
};

type MitspielerCardProps = {
  playerUserIds: number[];
  allUsers: User[];
};

const DRAG_TYPE = "x-tipprunde/user-id";

export function MitspielerCard({ playerUserIds: initialIds, allUsers }: MitspielerCardProps) {
  const fetcher = useFetcher();
  const [playerIds, setPlayerIds] = useState(() => new Set(initialIds));

  const inChampionship = useMemo(
    () => allUsers.filter((u) => playerIds.has(u.id)),
    [allUsers, playerIds],
  );
  const available = useMemo(
    () => allUsers.filter((u) => !playerIds.has(u.id)),
    [allUsers, playerIds],
  );

  const { dragAndDropHooks: inChampionshipHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((id) => ({ [DRAG_TYPE]: String(id) })),
    onRootDrop: async (e) => {
      for (const item of e.items) {
        if (item.kind === "text") {
          const userId = Number(await item.getText(DRAG_TYPE));
          setPlayerIds((prev) => new Set([...prev, userId]));
          fetcher.submit({ intent: "add-player", userId: String(userId) }, { method: "post" });
        }
      }
    },
    acceptedDragTypes: [DRAG_TYPE],
  });

  const { dragAndDropHooks: availableHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((id) => ({ [DRAG_TYPE]: String(id) })),
    onRootDrop: async (e) => {
      for (const item of e.items) {
        if (item.kind === "text") {
          const userId = Number(await item.getText(DRAG_TYPE));
          setPlayerIds((prev) => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
          fetcher.submit({ intent: "remove-player", userId: String(userId) }, { method: "post" });
        }
      }
    },
    acceptedDragTypes: [DRAG_TYPE],
  });

  return (
    <Card>
      <div className="border-subtle border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Mitspieler</h2>
      </div>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <PlayerList
            label={`Im Turnier (${inChampionship.length})`}
            users={inChampionship}
            dragAndDropHooks={inChampionshipHooks}
            emptyText="Noch keine Spieler im Turnier."
          />
          <PlayerList
            label="Alle Spieler"
            users={available}
            dragAndDropHooks={availableHooks}
            emptyText="Alle Spieler sind bereits im Turnier."
          />
        </div>
      </CardContent>
    </Card>
  );
}

type PlayerListProps = {
  label: string;
  users: User[];
  dragAndDropHooks: ReturnType<typeof useDragAndDrop>["dragAndDropHooks"];
  emptyText: string;
};

function PlayerList({ label, users, dragAndDropHooks, emptyText }: PlayerListProps) {
  return (
    <div className="space-y-2">
      <p className="text-muted text-xs font-medium tracking-wide uppercase">{label}</p>
      <ListBox
        aria-label={label}
        items={users}
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => (
          <p className="text-subtle px-3 py-8 text-center text-sm">{emptyText}</p>
        )}
        className={cn(
          "border-subtle min-h-48 rounded-sm border p-1 outline-none",
          "data-drop-target:border-accent data-drop-target:bg-accent/5",
        )}
      >
        {(user) => (
          <ListBoxItem
            id={user.id}
            textValue={user.name}
            className={cn(
              "cursor-grab rounded-sm px-3 py-2 text-sm outline-none",
              "hover:bg-nav-active data-focused:bg-nav-active",
              "data-dragging:cursor-grabbing data-dragging:opacity-40",
            )}
          >
            {user.name}
          </ListBoxItem>
        )}
      </ListBox>
    </div>
  );
}
