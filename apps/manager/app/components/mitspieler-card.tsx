import { Button, Label } from "@tipprunde/ui";
import { UserPlusIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ComboBox, Input, ListBox, ListBoxItem, Popover, useFilter } from "react-aria-components";
import { useFetcher } from "react-router";

import { cn } from "#/lib/utils.ts";

import { Card, CardContent } from "./card";
import { useLock } from "./lock-provider";
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

const listBoxItemClass = cn(
  "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
  "hover:bg-nav-active data-focused:bg-nav-active data-selected:bg-accent-subtle",
);

export function MitspielerCard({ playerUserIds: initialIds, allUsers }: MitspielerCardProps) {
  const isLocked = useLock();
  const fetcher = useFetcher();
  const { contains } = useFilter({ sensitivity: "base" });

  const [playerIds, setPlayerIds] = useState(() => new Set(initialIds));
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const refocusRef = useRef(false);

  // Restore focus to the add field once an add settles, so a season's worth of
  // players can be entered in quick succession without re-clicking the input.
  useEffect(() => {
    if (fetcher.state === "idle" && refocusRef.current) {
      refocusRef.current = false;
      inputRef.current?.focus();
    }
  }, [fetcher.state]);

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers]);

  // Enrolled players in insertion order (≈ player id asc), matching the loader's sort.
  const inChampionship = useMemo(
    () =>
      [...playerIds].flatMap((id) => {
        const u = userMap.get(id);
        return u ? [u] : [];
      }),
    [playerIds, userMap],
  );

  // Available pool (not yet enrolled); already name-sorted by the loader.
  const available = useMemo(
    () => allUsers.filter((u) => !playerIds.has(u.id)),
    [allUsers, playerIds],
  );

  function addPlayer(userId: number) {
    setPlayerIds((prev) => new Set([...prev, userId]));
    setQuery("");
    refocusRef.current = true;
    void fetcher.submit({ intent: "add-player", userId: String(userId) }, { method: "post" });
  }

  function removePlayer(userId: number) {
    setPlayerIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
    void fetcher.submit({ intent: "remove-player", userId: String(userId) }, { method: "post" });
  }

  return (
    <Card>
      <div className="border-subtle border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Mitspieler</h2>
      </div>
      <CardContent>
        <div className="space-y-4">
          <ComboBox
            value={null}
            onChange={(key) => key != null && addPlayer(Number(key))}
            inputValue={query}
            onInputChange={setQuery}
            defaultFilter={contains}
            isDisabled={isLocked}
            menuTrigger="focus"
            className="flex flex-col gap-1.5"
          >
            <Label>Spieler hinzufügen</Label>
            <div className="flex gap-4">
              <div
                className={cn(
                  "flex flex-1 rounded-sm",
                  "focus-within:ring-2 focus-within:ring-accent/60",
                )}
              >
                <Input
                  ref={inputRef}
                  placeholder="Name eingeben ..."
                  className="border-subtle bg-surface w-full rounded-sm border px-2.5 py-1.5 text-sm outline-none"
                />
              </div>
              <Button
                size="icon"
                isDisabled={isLocked}
                onPress={() => setIsCreateOpen(true)}
                aria-label="Neuer Spieler"
                className="shrink-0"
              >
                <UserPlusIcon className="size-4" />
              </Button>
            </div>
            <Popover
              placement="top start"
              className="bg-surface-raised border-subtle w-(--trigger-width) rounded-sm border shadow-lg outline-none"
            >
              <ListBox
                items={available}
                className="max-h-60 overflow-y-auto p-1 outline-none"
                renderEmptyState={() => (
                  <p className="text-subtle px-2.5 py-1.5 text-sm">Keine Spieler gefunden.</p>
                )}
              >
                {(user: User) => (
                  <ListBoxItem id={user.id} textValue={user.name} className={listBoxItemClass}>
                    {user.name}
                  </ListBoxItem>
                )}
              </ListBox>
            </Popover>
          </ComboBox>

          <div className="space-y-2">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">
              Im Turnier ({inChampionship.length})
            </p>
            {inChampionship.length === 0 ? (
              <p className="text-subtle border-subtle rounded-sm border px-3 py-8 text-center text-sm">
                Noch keine Spieler im Turnier.
              </p>
            ) : (
              <ul className="border-subtle divide-subtle max-h-92 divide-y overflow-y-auto rounded-sm border">
                {inChampionship.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                  >
                    <span>{user.name}</span>
                    <Button
                      intent="ghost"
                      size="icon"
                      isDisabled={isLocked}
                      onPress={() => removePlayer(user.id)}
                      aria-label={`${user.name} entfernen`}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <SpielerDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={(user) => addPlayer(user.id)}
        />
      </CardContent>
    </Card>
  );
}
