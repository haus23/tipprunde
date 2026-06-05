import { useEffect } from "react";
import {
  Button,
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { cn } from "#/lib/utils.ts";

// Local mirror of the create-round branch of the championship index action
type RundeActionData = { errors: Record<string, string[]> } | null;

type RundeFormProps = {
  nextNr: number;
  onClose: () => void;
};

function RundeForm({ nextNr, onClose }: RundeFormProps) {
  const fetcher = useFetcher<RundeActionData>();
  const isPending = fetcher.state !== "idle";
  const serverErrors = fetcher.data && "errors" in fetcher.data ? fetcher.data.errors : {};

  useEffect(() => {
    if (fetcher.state !== "idle") return;
    if (fetcher.data === null) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const inputClass = cn(
    "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
    "outline-none data-focused:ring-2 data-focused:ring-accent/60",
  );

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void fetcher.submit(e.currentTarget, { method: "post" });
      }}
      className="flex flex-col gap-5"
      validationErrors={serverErrors}
    >
      <input type="hidden" name="intent" value="create-round" />

      <TextField
        name="nr"
        defaultValue={String(nextNr)}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Rundennummer</Label>
        <Input type="number" min="1" className={cn(inputClass, "tabular-nums")} />
        <FieldError className="text-error text-xs" />
      </TextField>

      <div className="border-subtle flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
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
          type="submit"
          isDisabled={isPending}
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
    </Form>
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
