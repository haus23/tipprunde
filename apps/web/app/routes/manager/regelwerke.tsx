import { rulesets } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";

import { RegelwerkDialog } from "#/components/regelwerk-dialog.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/regelwerke";

type Ruleset = typeof rulesets.$inferSelect;

export const handle = { title: "Stammdaten | Regelwerke" };

const rulesetSchema = createInsertSchema(rulesets, {
  id: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kennung ist erforderlich")),
  name: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Name ist erforderlich")),
  tipRuleId: (schema) => v.pipe(schema, v.nonEmpty("Bitte eine Option wählen")),
  jokerRuleId: (schema) => v.pipe(schema, v.nonEmpty("Bitte eine Option wählen")),
  matchRuleId: (schema) => v.pipe(schema, v.nonEmpty("Bitte eine Option wählen")),
  roundRuleId: (schema) => v.pipe(schema, v.nonEmpty("Bitte eine Option wählen")),
  extraQuestionRuleId: (schema) => v.pipe(schema, v.nonEmpty("Bitte eine Option wählen")),
});

export async function loader() {
  const data = await db.query.rulesets.findMany({ orderBy: { name: "asc" } });
  return { rulesets: data };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(v.picklist(["create", "update"]), formData.get("intent"));

  const result = v.safeParse(rulesetSchema, Object.fromEntries(formData));

  if (!result.success) {
    return { errors: v.flatten(result.issues).nested ?? {} };
  }

  const { id, ...values } = result.output;

  if (intent === "create") {
    const existing = await db.query.rulesets.findFirst({
      where: { id },
    });
    if (existing) {
      return { errors: { id: ["Diese Kennung ist bereits vergeben"] } };
    }
  }

  // Rules are foundational — all scoring of championships using this ruleset
  // derives from them, so they are immutable after creation. On update (conflict)
  // only name + description change; the rule fields are applied on insert only.
  await db
    .insert(rulesets)
    .values(result.output)
    .onConflictDoUpdate({
      target: rulesets.id,
      set: { name: values.name, description: values.description },
    });
  return { ruleset: result.output };
}

export default function Regelwerke({ loaderData }: Route.ComponentProps) {
  const { rulesets: rulesetList } = loaderData;
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRuleset, setEditingRuleset] = useState<Ruleset | null>(null);

  const filtered = rulesetList.filter(
    (r) => !filter || `${r.name} ${r.id}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-8">
      <title>Regelwerke | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between gap-4">
        <SearchField
          aria-label="Regelwerke filtern"
          className="flex-1"
          value={filter}
          onChange={setFilter}
        />
        <Button onPress={() => setIsCreateOpen(true)}>
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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle py-16 text-center">
                {filter ? "Keine Ergebnisse." : "Noch keine Regelwerke angelegt."}
              </td>
            </tr>
          ) : (
            filtered.map((ruleset) => (
              <tr
                key={ruleset.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3 font-medium">{ruleset.name}</td>
                <td className="px-3 py-3">
                  <div className="text-subtle truncate text-sm">{ruleset.description}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => setEditingRuleset(ruleset)}
                    aria-label={`${ruleset.name} bearbeiten`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <RegelwerkDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(ruleset) => setFilter(ruleset.name)}
      />

      <RegelwerkDialog
        isOpen={!!editingRuleset}
        onOpenChange={(open) => !open && setEditingRuleset(null)}
        defaultValues={editingRuleset ?? undefined}
      />
    </div>
  );
}
