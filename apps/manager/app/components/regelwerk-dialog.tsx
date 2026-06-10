import type { rulesets } from "@tipprunde/db/schema";
import { RULE_CATEGORIES } from "@tipprunde/domain/rules";
import { Button } from "@tipprunde/ui";
import { useEffect, useState } from "react";
import {
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  RadioButton,
  RadioField,
  RadioGroup,
  TextArea,
  TextField,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { cn, slugify } from "#/lib/utils.ts";

type Ruleset = typeof rulesets.$inferSelect;

// Local mirror of the /regelwerke action's return shape — no route import needed
type RulesetActionData = { ruleset: Ruleset } | { errors: Record<string, string[]> } | null;

type RulesetFormProps = {
  defaultValues?: Ruleset;
  onClose: () => void;
  onSuccess?: (ruleset: Ruleset) => void;
};

function RulesetForm({ defaultValues, onClose, onSuccess }: RulesetFormProps) {
  const fetcher = useFetcher<RulesetActionData>();
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("errors" in fetcher.data) {
      setServerErrors(fetcher.data.errors);
    } else if ("ruleset" in fetcher.data) {
      onSuccess?.(fetcher.data.ruleset);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose, onSuccess]);

  const [idValue, setIdValue] = useState("");
  const [idDirty, setIdDirty] = useState(false);

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
          action: "/regelwerke",
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

      <TextField
        name="description"
        defaultValue={defaultValues?.description}
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Beschreibung</Label>
        <TextArea rows={2} className={cn(inputClass, "resize-none")} />
      </TextField>

      {RULE_CATEGORIES.map((category) => (
        <RadioGroup
          key={category.field}
          name={category.field}
          defaultValue={defaultValues?.[category.field]}
          isRequired
          className="flex flex-col gap-2"
        >
          <Label className="text-sm font-medium">{category.label}</Label>
          {category.rules.map((rule) => (
            <RadioField key={rule.value} value={rule.value}>
              <RadioButton
                className={cn(
                  "group flex cursor-pointer items-start gap-3 rounded-sm border p-3 text-sm",
                  "border-subtle transition-colors outline-none",
                  "hover:bg-nav-active",
                  "data-selected:border-accent data-selected:bg-accent-subtle",
                  "data-focused:ring-2 data-focused:ring-accent/60",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    "border-subtle",
                    "group-data-selected:border-accent",
                  )}
                >
                  <div
                    className={cn(
                      "size-2 scale-0 rounded-full transition-transform",
                      "bg-accent",
                      "group-data-selected:scale-100",
                    )}
                  />
                </div>
                <div>
                  <div className="font-medium">{rule.label}</div>
                  {rule.description && (
                    <div className="text-subtle mt-0.5 text-xs">{rule.description}</div>
                  )}
                </div>
              </RadioButton>
            </RadioField>
          ))}
          <FieldError className="text-error text-xs" />
        </RadioGroup>
      ))}

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

type RegelwerkDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Ruleset;
  onSuccess?: (ruleset: Ruleset) => void;
};

export function RegelwerkDialog({
  isOpen,
  onOpenChange,
  defaultValues,
  onSuccess,
}: RegelwerkDialogProps) {
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
              {defaultValues ? "Regelwerk bearbeiten" : "Neues Regelwerk"}
            </Heading>
          </div>
          <div className="max-h-[70dvh] overflow-y-auto px-6 py-5">
            {isOpen && (
              <RulesetForm defaultValues={defaultValues} onClose={onClose} onSuccess={onSuccess} />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
