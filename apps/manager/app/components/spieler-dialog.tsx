import type { users } from "@tipprunde/db/schema";
import { Button, FieldError, Label, TextField } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button as RACButton,
  Dialog,
  Form,
  Heading,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { slugify } from "#/lib/utils.ts";

type User = typeof users.$inferSelect;

// Local mirror of the /spieler action's return shape — no route import needed
type SpielerActionData = { user: User } | { errors: Record<string, string[]> } | null;

const roleOptions = [
  { value: "user", label: "Spieler" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
] as const;

type SpielerFormProps = {
  defaultValues?: User;
  onClose: () => void;
  onSuccess?: (user: User) => void;
};

function SpielerForm({ defaultValues, onClose, onSuccess }: SpielerFormProps) {
  const fetcher = useFetcher<SpielerActionData>();
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";
  const serverErrors =
    fetcher.state === "idle" && fetcher.data && "errors" in fetcher.data ? fetcher.data.errors : {};

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("user" in fetcher.data) {
      onSuccess?.(fetcher.data.user);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [slugValue, setSlugValue] = useState(defaultValues?.slug ?? "");
  const slugDirty = useRef(isEdit);

  // Shared with the role Select trigger below; will fold into a Select primitive later.
  const inputClass = cx(
    "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
    "outline-none data-focused:ring-2 data-focused:ring-accent/60",
  );

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void fetcher.submit(e.currentTarget, {
          method: "post",
          action: "/spieler",
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
        label="Name"
        inputProps={{
          onBlur: (e) => {
            if (!slugDirty.current) {
              setSlugValue(slugify(e.target.value));
            }
          },
        }}
      />

      <TextField
        name="slug"
        value={slugValue}
        onChange={(v) => {
          setSlugValue(v);
          slugDirty.current = true;
        }}
        isReadOnly={isEdit}
        isRequired
        label="Kennung"
        inputProps={{ className: cx("font-mono", isEdit && "text-subtle cursor-default") }}
      />

      <TextField
        name="email"
        type="email"
        defaultValue={defaultValues?.email ?? ""}
        label="E-Mail"
      />

      <Select
        name="role"
        defaultValue={defaultValues?.role ?? "user"}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label>Rolle</Label>
        <RACButton className={cx(inputClass, "flex w-full items-center justify-between gap-2")}>
          <SelectValue className="text-sm" />
          <ChevronDownIcon className="text-muted size-4 shrink-0" />
        </RACButton>
        <FieldError />
        <Popover className="bg-surface-raised border-subtle w-[--trigger-width] rounded-sm border shadow-lg outline-none">
          <ListBox className="p-1">
            {roleOptions.map((option) => (
              <ListBoxItem
                key={option.value}
                id={option.value}
                className={cx(
                  "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
                  "hover:bg-nav-active",
                  "data-focused:bg-nav-active",
                  "data-selected:bg-accent-subtle",
                )}
              >
                {option.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

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

type SpielerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: User;
  onSuccess?: (user: User) => void;
};

export function SpielerDialog({
  isOpen,
  onOpenChange,
  defaultValues,
  onSuccess,
}: SpielerDialogProps) {
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
              {defaultValues ? "Spieler bearbeiten" : "Neuer Spieler"}
            </Heading>
          </div>
          <div className="px-6 py-5">
            {isOpen && (
              <SpielerForm defaultValues={defaultValues} onClose={onClose} onSuccess={onSuccess} />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
