import type { leagues } from "@tipprunde/db/schema";
import { useEffect, useState } from "react";
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

import { cn, slugify } from "#/lib/utils.ts";

type League = typeof leagues.$inferSelect;

// Local mirror of the /ligen action's return shape — no route import needed
type LigaActionData = { league: League } | { errors: Record<string, string[]> } | null;

type LigaFormProps = {
  defaultValues?: League;
  onClose: () => void;
  onSuccess?: (league: League) => void;
};

function LigaForm({ defaultValues, onClose, onSuccess }: LigaFormProps) {
  const fetcher = useFetcher<LigaActionData>();
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("errors" in fetcher.data) {
      setServerErrors(fetcher.data.errors);
    } else if ("league" in fetcher.data) {
      onSuccess?.(fetcher.data.league);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [idValue, setIdValue] = useState(defaultValues?.id ?? "");
  const [idDirty, setIdDirty] = useState(isEdit);

  const inputClass = cn(
    "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
    "outline-none data-focused:ring-2 data-focused:ring-accent/60",
  );

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void fetcher.submit(e.currentTarget, {
          method: "post",
          action: "/ligen",
        });
      }}
      className="flex flex-col gap-5"
      validationErrors={serverErrors}
    >
      <input type="hidden" name="intent" value={isEdit ? "update" : "create"} />
      {isEdit && <input type="hidden" name="id" value={defaultValues.id} />}

      <TextField
        name="name"
        defaultValue={defaultValues?.name}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Name</Label>
        <Input className={inputClass} />
        <FieldError className="text-error text-xs" />
      </TextField>

      <TextField
        name="shortName"
        defaultValue={defaultValues?.shortName}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Kurzname</Label>
        <Input
          className={inputClass}
          onBlur={(e) => {
            if (!idDirty) {
              setIdValue(slugify(e.target.value));
              setServerErrors({});
            }
          }}
        />
        <FieldError className="text-error text-xs" />
      </TextField>

      {!isEdit && (
        <TextField
          name="id"
          value={idValue}
          onChange={(v) => {
            setIdValue(v);
            setIdDirty(true);
            setServerErrors({});
          }}
          isRequired
          className="flex flex-col gap-1.5"
        >
          <Label className="text-sm font-medium">Kennung (eindeutig)</Label>
          <Input className={cn(inputClass, "font-mono")} />
          <FieldError className="text-error text-xs" />
        </TextField>
      )}

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
            "disabled:opacity-50",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          {isPending ? "…" : isEdit ? "Speichern" : "Erstellen"}
        </Button>
      </div>
    </Form>
  );
}

type LigaDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: League;
  onSuccess?: (league: League) => void;
};

export function LigaDialog({ isOpen, onOpenChange, defaultValues, onSuccess }: LigaDialogProps) {
  const onClose = () => onOpenChange(false);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <Modal className="bg-surface-raised border-subtle w-full max-w-md rounded-md border shadow-xl outline-none">
        <Dialog className="outline-none">
          <div className="border-subtle border-b px-6 py-4">
            <Heading slot="title" className="text-base font-semibold">
              {defaultValues ? "Liga bearbeiten" : "Neue Liga"}
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && (
              <LigaForm defaultValues={defaultValues} onClose={onClose} onSuccess={onSuccess} />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
