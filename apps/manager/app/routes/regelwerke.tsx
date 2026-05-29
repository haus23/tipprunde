import { rulesets } from "@tipprunde/db/schema";
import { JOKER_RULES, RULE_CATEGORIES, TIP_RULES } from "@tipprunde/domain/rules";
import { eq } from "drizzle-orm";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Cell,
  Column,
  Dialog,
  FieldError,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  Radio,
  RadioGroup,
  Row,
  Table,
  TableBody,
  TableHeader,
  TextArea,
  TextField,
} from "react-aria-components";
import { useFetcher } from "react-router";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

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
    const ruleset = { id: crypto.randomUUID(), ...values };
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

function getRuleLabel(rules: { value: string; label: string }[], id: string) {
  return rules.find((r) => r.value === id)?.label ?? id;
}

type RulesetFormProps = {
  defaultValues?: Ruleset;
  fetcher: ReturnType<typeof useFetcher<typeof action>>;
  onClose: () => void;
};

function RulesetForm({ defaultValues, fetcher, onClose }: RulesetFormProps) {
  const isEdit = !!defaultValues;
  const isPending = fetcher.state !== "idle";

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
          className={cn(
            "border-subtle bg-surface rounded-sm border px-2.5 py-1.5 text-sm",
            "outline-none data-focused:ring-2 data-focused:ring-accent/60",
          )}
        />
        <FieldError className="text-xs text-red-500" />
      </TextField>

      <TextField
        name="description"
        defaultValue={defaultValues?.description}
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium">Beschreibung</Label>
        <TextArea
          rows={2}
          className={cn(
            "border-subtle bg-surface resize-none rounded-sm border px-2.5 py-1.5 text-sm",
            "outline-none data-focused:ring-2 data-focused:ring-accent/60",
          )}
        />
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
            <Radio
              key={rule.value}
              value={rule.value}
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
            </Radio>
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
          )}
        >
          <PlusIcon className="size-4" />
          Neues Regelwerk
        </Button>
      </div>

      <Table aria-label="Regelwerke" className="w-full border-collapse text-sm">
        <TableHeader>
          <Column
            id="name"
            isRowHeader
            className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase"
          >
            Name
          </Column>
          <Column
            id="tipRule"
            className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase"
          >
            Punkte-Regel
          </Column>
          <Column
            id="jokerRule"
            className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase"
          >
            Joker-Regel
          </Column>
          <Column id="actions" className="border-subtle w-0 border-b px-3 py-2.5" />
        </TableHeader>
        <TableBody
          items={rulesetList}
          renderEmptyState={() => (
            <div className="text-subtle py-16 text-center text-sm">
              Noch keine Regelwerke angelegt.
            </div>
          )}
        >
          {(ruleset) => (
            <Row
              id={ruleset.id}
              className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
            >
              <Cell className="px-3 py-3">
                <div className="font-medium">{ruleset.name}</div>
                {ruleset.description && (
                  <div className="text-subtle mt-0.5 text-xs">{ruleset.description}</div>
                )}
              </Cell>
              <Cell className="text-subtle px-3 py-3 text-xs">
                {getRuleLabel(TIP_RULES, ruleset.tipRuleId)}
              </Cell>
              <Cell className="text-subtle px-3 py-3 text-xs">
                {getRuleLabel(JOKER_RULES, ruleset.jokerRuleId)}
              </Cell>
              <Cell className="px-3 py-3">
                <Button
                  onPress={() => setEditingRuleset(ruleset)}
                  className={cn(
                    "text-muted inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs transition-colors",
                    "hover:bg-nav-active hover:text-app",
                  )}
                >
                  <PencilIcon className="size-3.5" />
                  Bearbeiten
                </Button>
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>

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
