import { useState } from "react";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";
import { Command, CommandItem } from "@/components/(ui)/command.tsx";
import { activateChampionship } from "@/lib/championships.ts";
import type { Championship } from "@/lib/championships.ts";

interface Props {
  current: Championship;
  championships: Championship[];
}

export function ChampionshipSwitcher({ current, championships }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const matches = useMatches();

  async function handleSelect(championship: Championship) {
    setIsOpen(false);

    // Set cookie before navigating so manager beforeLoad sees the updated value
    await activateChampionship({ data: championship.slug });

    // Try to preserve the current sub-route (e.g. /turnier)
    const slugMatch = matches.find((m) => m.routeId.startsWith("/manager/$slug/"));
    const subRoute = slugMatch?.routeId.replace("/manager/$slug", "") ?? "";

    if (subRoute === "/turnier") {
      navigate({ to: "/manager/$slug/turnier", params: { slug: championship.slug } });
    } else {
      navigate({ to: "/manager/$slug", params: { slug: championship.slug } });
    }
  }

  if (championships.length <= 1) {
    return <span className="truncate px-2 text-sm">{current.name}</span>;
  }

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-none">
        <span className="truncate">{current.name}</span>
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
              keyProp="slug"
              onSelect={handleSelect}
              filter={(item, search) =>
                `${item.name} ${item.slug}`.toLowerCase().includes(search.toLowerCase())
              }
            >
              {(championship) => (
                <CommandItem key={championship.slug} value={championship.slug}>
                  <span className="flex-1">{championship.name}</span>
                  {championship.slug === current.slug && (
                    <CheckIcon size={16} className="text-subtle shrink-0" />
                  )}
                </CommandItem>
              )}
            </Command>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
