import type { rulesets } from "@tipprunde/db/schema";
import { RULE_CATEGORIES } from "@tipprunde/domain/rules";
import { Button, FieldError, Label, TextArea, TextField } from "@tipprunde/ui";
import { useEffect, useState } from "react";
import {
  Dialog,
  Form,
  Heading,
  Modal,
  ModalOverlay,
  RadioButton,
  RadioField,
  RadioGroup,
  TextField as AriaTextField,
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

/** Read-only display of a chosen rule (edit mode — rules are immutable). */
function StaticRuleField({
  category,
  ruleset,
}: {
  category: (typeof RULE_CATEGORIES)[number];
  ruleset: Ruleset;
}) {
  const value = ruleset[category.field];
  const selected = category.rules.find((r) => r.value === value);
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{category.label}</Label>
      <input type="hidden" name={category.field} value={value ?? ""} />
      <div className="border-subtle text-subtle rounded-sm border p-3 text-sm">
        <div className="font-medium">{selected?.label ?? "—"}</div>
        {selected?.description && (
          <div className="text-muted mt-0.5 text-xs">{selected.description}</div>
        )}
      </div>
    </div>
  );
}

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
        label="Name"
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

      <AriaTextField
        name="description"
        defaultValue={defaultValues?.description}
        className="flex flex-col gap-1.5"
      >
        <Label>Beschreibung</Label>
        <TextArea rows={2} />
      </AriaTextField>

      {isEdit && (
        <p className="text-muted -mb-2 text-xs">Regeln sind nach Erstellung nicht änderbar.</p>
      )}
      {RULE_CATEGORIES.map((category) =>
        isEdit ? (
          <StaticRuleField key={category.field} category={category} ruleset={defaultValues!} />
        ) : (
          <RadioGroup
            key={category.field}
            name={category.field}
            defaultValue={defaultValues?.[category.field]}
            isRequired
            className="flex flex-col gap-2"
          >
            <Label>{category.label}</Label>
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
            <FieldError />
          </RadioGroup>
        ),
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
