import type { leagues } from "@tipprunde/db/schema";
import { Button, TextField } from "@tipprunde/ui";
import { useEffect, useState } from "react";
import { Dialog, Form, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useFetcher } from "react-router";

import { slugify } from "#/lib/utils.ts";

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

      <TextField name="name" defaultValue={defaultValues?.name} isRequired label="Name" />

      <TextField
        name="shortName"
        defaultValue={defaultValues?.shortName}
        isRequired
        label="Kurzname"
        inputProps={{
          onBlur: (e) => {
            if (!idDirty) {
              setIdValue(slugify(e.target.value));
              setServerErrors({});
            }
          },
        }}
      />

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
          label="Kennung (eindeutig)"
          inputProps={{ className: "font-mono" }}
        />
      )}

      <div className="border-subtle flex justify-end gap-3 border-t pt-4">
        <Button intent="secondary" type="button" onPress={onClose}>
          Abbrechen
        </Button>
        <Button type="submit" isDisabled={isPending}>
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
