"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";
import type { championships } from "@/lib/db/schema";
import { Command, CommandItem } from "@/components/(ui)/command";

type Championship = typeof championships.$inferSelect;

interface Props {
  currentName?: string;
  championships: Championship[];
}

export function ChampionshipSwitcher({ currentName, championships }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  function handleSelect(championship: Championship) {
    setIsOpen(false);
    const segments = pathname.split("/");
    const staticSegments = new Set(["stammdaten", "turnier"]);
    const isOnSlugRoute = segments[2] && !staticSegments.has(segments[2]);
    const newPath = isOnSlugRoute
      ? ["", "manager", championship.slug, ...segments.slice(3)].join("/")
      : `/manager/${championship.slug}`;
    router.push(newPath);
    router.refresh();
  }

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button className="hover:bg-subtle flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-sm outline-none">
        <span className="text-subtle truncate">{currentName ?? "Turnier wählen"}</span>
        <ChevronsUpDownIcon size={14} className="text-subtle shrink-0" />
      </Button>

      <ModalOverlay
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
        isDismissable
      >
        <Modal className="border-input bg-base my-16 w-full max-w-md rounded-xl border shadow-lg">
          <Dialog className="outline-none">
            <Heading slot="title" className="sr-only">
              Turnier wechseln
            </Heading>
            <Command
              label="Turnier suchen"
              placeholder="Turnier suchen…"
              items={championships}
              keyProp={"slug"}
              onSelect={handleSelect}
              filter={(item, search) =>
                `${item.name} ${item.slug}`.toLowerCase().includes(search.toLowerCase())
              }
            >
              {(championship) => (
                <CommandItem key={championship.slug} value={championship.slug}>
                  {championship.name}
                </CommandItem>
              )}
            </Command>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
