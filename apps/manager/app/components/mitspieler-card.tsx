import { UserPlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ListBox, ListBoxItem, useDragAndDrop } from "react-aria-components";
import { useFetcher } from "react-router";

import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "./card";
import { FilterInput } from "./filter-input";
import { SpielerDialog } from "./spieler-dialog";

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
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const inChampionship = useMemo(() => {
    const userMap = new Map(allUsers.map((u) => [u.id, u]));
    return [...playerIds].flatMap((id) => {
      const u = userMap.get(id);
      return u ? [u] : [];
    });
  }, [allUsers, playerIds]);
  const available = useMemo(() => {
    const all = allUsers.filter((u) => !playerIds.has(u.id));
    if (!filter) return all;
    const q = filter.toLowerCase();
    return all.filter((u) => u.name.toLowerCase().includes(q));
  }, [allUsers, playerIds, filter]);

  const { dragAndDropHooks: inChampionshipHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((id) => ({ [DRAG_TYPE]: String(id) })),
    onRootDrop: async (e) => {
      for (const item of e.items) {
        if (item.kind === "text") {
          const userId = Number(await item.getText(DRAG_TYPE));
          setPlayerIds((prev) => new Set([...prev, userId]));
          setFilter("");
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
          <div className="space-y-2">
            <PlayerList
              label="Alle Spieler"
              users={available}
              dragAndDropHooks={availableHooks}
              emptyText={filter ? "Keine Ergebnisse." : "Alle Spieler sind bereits im Turnier."}
              fixedHeight
            />
            <div className="flex items-center gap-4">
              <FilterInput value={filter} onChange={setFilter} />
              <Button
                onPress={() => setIsCreateOpen(true)}
                aria-label="Neuer Spieler"
                className={cn(
                  "bg-accent text-accent-fg shrink-0 rounded-sm p-1.5 transition-colors",
                  "hover:bg-accent-hover",
                  "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
                )}
              >
                <UserPlusIcon className="size-4" />
              </Button>
            </div>
          </div>

          <SpielerDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSuccess={(user) => setFilter(user.name)}
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
  fixedHeight?: boolean;
};

function PlayerList({ label, users, dragAndDropHooks, emptyText, fixedHeight }: PlayerListProps) {
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
          "border-subtle overflow-y-auto rounded-sm border p-1 outline-none",
          fixedHeight ? "h-92" : "max-h-92",
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
