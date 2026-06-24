import type { championships, rulesets } from "@tipprunde/db/schema";
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

// Championships follow a fixed naming convention, so the slug can be derived:
// "Hinrunde 2002/03" → "hr0203", "Rückrunde 2022/23" → "rr2223"
// "WM 2006"          → "wm2006", "EM 2012"           → "em2012"
function deriveSlug(name: string): string {
  const match = name.match(/^([HRWE]).*(\d{2})\/?(\d{2})$/i);
  if (!match) return "";
  const first = match[1].toLowerCase();
  const second = ["h", "r"].includes(first) ? "r" : "m";
  return first + second + match[2] + match[3];
}

type Championship = typeof championships.$inferSelect;
type Ruleset = Pick<typeof rulesets.$inferSelect, "id" | "name">;

// Local mirror of the /turniere action's return shape — no route import needed
type ChampionshipActionData =
  | { championship: Championship }
  | { errors: Record<string, string[]> }
  | null;

type TurnierFormProps = {
  defaultValues?: Championship;
  rulesets: Ruleset[];
  nextNr?: number;
  onClose: () => void;
  onSuccess?: (championship: Championship) => void;
};

function TurnierForm({ defaultValues, rulesets, nextNr, onClose, onSuccess }: TurnierFormProps) {
  const fetcher = useFetcher<ChampionshipActionData>();
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";
  const serverErrors =
    fetcher.state === "idle" && fetcher.data && "errors" in fetcher.data ? fetcher.data.errors : {};

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("championship" in fetcher.data) {
      onSuccess?.(fetcher.data.championship);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [slugValue, setSlugValue] = useState(defaultValues?.slug ?? "");
  const slugDirty = useRef(isEdit);

  // Shared with the regelwerk Select trigger below; will fold into a Select primitive later.
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
          action: "/turniere",
        });
      }}
      className="flex flex-col gap-5"
      validationErrors={serverErrors}
    >
      <input type="hidden" name="intent" value={isEdit ? "update" : "create"} />
      {isEdit && <input type="hidden" name="id" value={defaultValues.id} />}

      <TextField
        name="nr"
        type="number"
        defaultValue={String(defaultValues?.nr ?? nextNr ?? "")}
        isRequired
        label="Nummer"
        inputProps={{ min: 1, className: "w-24" }}
      />

      <TextField
        name="name"
        defaultValue={defaultValues?.name}
        isRequired
        label="Name"
        inputProps={{
          onBlur: (e) => {
            if (!slugDirty.current) {
              setSlugValue(deriveSlug(e.target.value));
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

      {isEdit ? (
        // Ruleset is foundational — all scoring derives from it, so it is
        // immutable after creation. Hidden input keeps it in the submission
        // (the action drops it server-side regardless).
        <div className="flex flex-col gap-1.5">
          <Label>Regelwerk</Label>
          <input type="hidden" name="rulesetId" value={defaultValues?.rulesetId ?? ""} />
          <div className={cx(inputClass, "text-subtle cursor-default")}>
            {rulesets.find((r) => r.id === defaultValues?.rulesetId)?.name ?? "—"}
          </div>
          <p className="text-muted text-xs">Nach Erstellung nicht änderbar.</p>
        </div>
      ) : (
        <Select name="rulesetId" isRequired className="flex flex-col gap-1.5">
          <Label>Regelwerk</Label>
          <RACButton className={cx(inputClass, "flex w-full items-center justify-between gap-2")}>
            <SelectValue className="text-sm">
              {({ isPlaceholder, defaultChildren }) =>
                isPlaceholder ? (
                  <span className="text-subtle">Regelwerk wählen …</span>
                ) : (
                  defaultChildren
                )
              }
            </SelectValue>
            <ChevronDownIcon className="text-muted size-4 shrink-0" />
          </RACButton>
          <FieldError />
          <Popover className="bg-surface-raised border-subtle w-[--trigger-width] rounded-sm border shadow-lg outline-none">
            <ListBox className="p-1">
              {rulesets.map((ruleset) => (
                <ListBoxItem
                  key={ruleset.id}
                  id={ruleset.id}
                  className={cx(
                    "cursor-pointer rounded-sm px-2.5 py-1.5 text-sm outline-none",
                    "hover:bg-nav-active",
                    "data-focused:bg-nav-active",
                    "data-selected:bg-accent-subtle",
                  )}
                >
                  {ruleset.name}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
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

type TurnierDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Championship;
  rulesets: Ruleset[];
  nextNr?: number;
  onSuccess?: (championship: Championship) => void;
};

export function TurnierDialog({
  isOpen,
  onOpenChange,
  defaultValues,
  rulesets,
  nextNr,
  onSuccess,
}: TurnierDialogProps) {
  const onClose = () => onOpenChange(false);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <Modal className="bg-surface-raised border-subtle w-full max-w-lg rounded-md border shadow-xl outline-none">
        <Dialog className="outline-none">
          <div className="border-subtle border-b px-6 py-4">
            <Heading slot="title" className="text-base font-semibold">
              {defaultValues ? "Turnier bearbeiten" : "Neues Turnier"}
            </Heading>
          </div>
          <div className="max-h-[70dvh] overflow-y-auto px-6 py-5">
            {isOpen && (
              <TurnierForm
                defaultValues={defaultValues}
                rulesets={rulesets}
                nextNr={nextNr}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
