import { rulesets } from "@tipprunde/db/schema";
import { RULE_CATEGORIES } from "@tipprunde/domain/rules";
import { eq } from "drizzle-orm";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  FieldError,
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

import { db } from "#/lib/db.server.ts";
import { cn, slugify } from "#/lib/utils.ts";

import type { Route } from "./+types/regelwerke";

type Ruleset = typeof rulesets.$inferSelect;

export async function loader() {
  const data = await db.query.rulesets.findMany({ orderBy: { name: "asc" } });
  return { rulesets: data };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  const values = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    tipRuleId: formData.get("tipRuleId") as string,
    jokerRuleId: formData.get("jokerRuleId") as string,
    matchRuleId: formData.get("matchRuleId") as string,
    roundRuleId: formData.get("roundRuleId") as string,
    extraQuestionRuleId: formData.get("extraQuestionRuleId") as string,
  };

  if (intent === "create") {
    const id = formData.get("id") as string;
    const ruleset = { id, ...values };
    await db.insert(rulesets).values(ruleset);
    return { ruleset };
  }

  if (intent === "update") {
    const id = formData.get("id") as string;
    await db.update(rulesets).set(values).where(eq(rulesets.id, id));
    return { ruleset: { id, ...values } };
  }

  return null;
}

type RulesetFormProps = {
  defaultValues?: Ruleset;
  fetcher: ReturnType<typeof useFetcher<typeof action>>;
  onClose: () => void;
};

function RulesetForm({ defaultValues, fetcher, onClose }: RulesetFormProps) {
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";

  const [idValue, setIdValue] = useState("");
  const [idDirty, setIdDirty] = useState(false);

  const inputClass = cn(
    "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
    "outline-none data-focused:ring-2 data-focused:ring-accent/60",
  );

  return (
    <fetcher.Form method="post" className="flex flex-col gap-5">
      <input type="hidden" name="intent" value={isEdit ? "update" : "create"} />
      {isEdit && <input type="hidden" name="id" value={defaultValues.id} />}

      <TextField
        name="name"
        defaultValue={defaultValues?.name}
        isRequired
        validationBehavior="native"
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Name</Label>
        <Input
          className={inputClass}
          onBlur={(e) => {
            if (!idDirty) setIdValue(slugify(e.target.value));
          }}
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      {!isEdit && (
        <TextField
          name="id"
          value={idValue}
          onChange={(v) => {
            setIdValue(v);
            setIdDirty(true);
          }}
          isRequired
          validationBehavior="native"
          className="flex flex-col gap-1.5"
        >
          <Label className="text-sm font-medium">Kennung (eindeutig)</Label>
          <Input className={cn(inputClass, "font-mono")} />
          <FieldError className="text-xs text-red-500" />
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
                      "bg-btn",
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
          <FieldError className="text-xs text-red-500" />
        </RadioGroup>
      ))}

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
    </fetcher.Form>
  );
}

type RulesetDialogProps = {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function RulesetDialog({ title, isOpen, onOpenChange, children }: RulesetDialogProps) {
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
              {title}
            </Heading>
          </div>
          <div className="max-h-[70dvh] overflow-y-auto px-6 py-5">{children}</div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export default function Regelwerke({ loaderData }: Route.ComponentProps) {
  const { rulesets: rulesetList } = loaderData;
  const fetcher = useFetcher<typeof action>();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRuleset, setEditingRuleset] = useState<Ruleset | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ruleset) {
      setIsCreateOpen(false);
      setEditingRuleset(null);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Regelwerke</h1>
        <Button
          onPress={() => setIsCreateOpen(true)}
          className={cn(
            "bg-btn text-btn flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-btn-hover",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          <PlusIcon className="size-4" />
          Neues Regelwerk
        </Button>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-subtle text-muted w-56 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Name
            </th>
            <th className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Beschreibung
            </th>
            <th className="border-subtle w-12 border-b" />
          </tr>
        </thead>
        <tbody>
          {rulesetList.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle py-16 text-center">
                Noch keine Regelwerke angelegt.
              </td>
            </tr>
          ) : (
            rulesetList.map((ruleset) => (
              <tr
                key={ruleset.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3 font-medium">{ruleset.name}</td>
                <td className="px-3 py-3">
                  <div className="text-subtle truncate text-sm">{ruleset.description}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => setEditingRuleset(ruleset)}
                    aria-label={`${ruleset.name} bearbeiten`}
                    className={cn(
                      "text-muted rounded-sm p-1.5 transition-colors",
                      "hover:bg-nav-active hover:text-app",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    )}
                  >
                    <PencilIcon className="size-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <RulesetDialog title="Neues Regelwerk" isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <RulesetForm fetcher={fetcher} onClose={() => setIsCreateOpen(false)} />
      </RulesetDialog>

      <RulesetDialog
        title="Regelwerk bearbeiten"
        isOpen={!!editingRuleset}
        onOpenChange={(open) => !open && setEditingRuleset(null)}
      >
        {editingRuleset && (
          <RulesetForm
            defaultValues={editingRuleset}
            fetcher={fetcher}
            onClose={() => setEditingRuleset(null)}
          />
        )}
      </RulesetDialog>
    </div>
  );
}
