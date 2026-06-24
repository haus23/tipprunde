import type { teams } from "@tipprunde/db/schema";
import { Button, TextField } from "@tipprunde/ui";
import { useEffect, useRef, useState } from "react";
import { Dialog, Form, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useFetcher } from "react-router";

import { slugify } from "#/lib/utils.ts";

type Team = typeof teams.$inferSelect;

// Local mirror of the /teams action's return shape — no route import needed
type TeamActionData = { team: Team } | { errors: Record<string, string[]> } | null;

type TeamFormProps = {
  defaultValues?: Team;
  onClose: () => void;
  onSuccess?: (team: Team) => void;
};

function TeamForm({ defaultValues, onClose, onSuccess }: TeamFormProps) {
  const fetcher = useFetcher<TeamActionData>();
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";
  const serverErrors =
    fetcher.state === "idle" && fetcher.data && "errors" in fetcher.data ? fetcher.data.errors : {};

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("team" in fetcher.data) {
      onSuccess?.(fetcher.data.team);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [idValue, setIdValue] = useState(defaultValues?.id ?? "");
  const idDirty = useRef(isEdit);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void fetcher.submit(e.currentTarget, {
          method: "post",
          action: "/teams",
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
            if (!idDirty.current) {
              setIdValue(slugify(e.target.value));
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
            idDirty.current = true;
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

type TeamDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Team;
  onSuccess?: (team: Team) => void;
};

export function TeamDialog({ isOpen, onOpenChange, defaultValues, onSuccess }: TeamDialogProps) {
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
              {defaultValues ? "Team bearbeiten" : "Neues Team"}
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && (
              <TeamForm defaultValues={defaultValues} onClose={onClose} onSuccess={onSuccess} />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
