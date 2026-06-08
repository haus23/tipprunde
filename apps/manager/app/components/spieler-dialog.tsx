import type { users } from "@tipprunde/db/schema";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { cn, slugify } from "#/lib/utils.ts";

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
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("errors" in fetcher.data) {
      setServerErrors(fetcher.data.errors);
    } else if ("user" in fetcher.data) {
      onSuccess?.(fetcher.data.user);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [slugValue, setSlugValue] = useState(defaultValues?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(isEdit);

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
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Name</Label>
        <Input
          className={inputClass}
          onBlur={(e) => {
            if (!slugDirty) {
              setSlugValue(slugify(e.target.value));
              setServerErrors({});
            }
          }}
        />
        <FieldError className="text-error text-xs" />
      </TextField>

      <TextField
        name="slug"
        value={slugValue}
        onChange={(v) => {
          setSlugValue(v);
          setSlugDirty(true);
          setServerErrors({});
        }}
        isReadOnly={isEdit}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Kennung</Label>
        <Input className={cn(inputClass, "font-mono", isEdit && "text-subtle cursor-default")} />
        <FieldError className="text-error text-xs" />
      </TextField>

      <TextField
        name="email"
        defaultValue={defaultValues?.email ?? ""}
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">E-Mail</Label>
        <Input type="email" className={inputClass} />
        <FieldError className="text-error text-xs" />
      </TextField>

      <Select
        name="role"
        defaultValue={defaultValues?.role ?? "user"}
        isRequired
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Rolle</Label>
        <Button className={cn(inputClass, "flex w-full items-center justify-between gap-2")}>
          <SelectValue className="text-sm" />
          <ChevronDownIcon className="text-muted size-4 shrink-0" />
        </Button>
        <FieldError className="text-error text-xs" />
        <Popover className="bg-surface-raised border-subtle w-[--trigger-width] rounded-sm border shadow-lg outline-none">
          <ListBox className="p-1">
            {roleOptions.map((option) => (
              <ListBoxItem
                key={option.value}
                id={option.value}
                className={cn(
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
            "bg-accent text-accent-fg rounded-md px-4 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent-hover",
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
