import { useEffect } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useFetcher } from "react-router";

import { cn } from "#/lib/utils.ts";

type RundeFormProps = {
  nextNr: number;
  onClose: () => void;
};

function RundeForm({ nextNr, onClose }: RundeFormProps) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm">
        Runde <span className="font-semibold tabular-nums">{nextNr}</span> wird angelegt.
      </p>
      <div className="flex justify-end gap-3">
        <Button
          onPress={onClose}
          className={cn(
            "rounded-sm border border-subtle px-4 py-2 text-sm transition-colors",
            "hover:bg-nav-active",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          Abbrechen
        </Button>
        <Button
          isDisabled={isPending}
          onPress={() => void fetcher.submit({ intent: "create-round" }, { method: "post" })}
          className={cn(
            "bg-btn text-btn rounded-md px-4 py-2 text-sm font-medium transition-colors",
            "hover:bg-btn-hover",
            "data-disabled:opacity-50",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          {isPending ? "…" : "Erstellen"}
        </Button>
      </div>
    </div>
  );
}

type RundeDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nextNr: number;
};

export function RundeDialog({ isOpen, onOpenChange, nextNr }: RundeDialogProps) {
  const onClose = () => onOpenChange(false);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <Modal className="bg-surface-raised border-subtle w-full max-w-sm rounded-md border shadow-xl outline-none">
        <Dialog className="outline-none">
          <div className="border-subtle border-b px-6 py-4">
            <Heading slot="title" className="text-base font-semibold">
              Neue Runde
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && <RundeForm nextNr={nextNr} onClose={onClose} />}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
