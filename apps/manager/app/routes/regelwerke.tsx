import { rulesets } from "@tipprunde/db/schema";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "react-aria-components";
import * as v from "valibot";

import { RegelwerkDialog } from "#/components/regelwerk-dialog.tsx";
import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

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

  await db.insert(rulesets).values(result.output).onConflictDoUpdate({
    target: rulesets.id,
    set: values,
  });
  return { ruleset: result.output };
}

export default function Regelwerke({ loaderData }: Route.ComponentProps) {
  const { rulesets: rulesetList } = loaderData;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRuleset, setEditingRuleset] = useState<Ruleset | null>(null);

  return (
    <div className="p-8">
      <title>Regelwerke | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between">
        <div />
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

      <RegelwerkDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <RegelwerkDialog
        isOpen={!!editingRuleset}
        onOpenChange={(open) => !open && setEditingRuleset(null)}
        defaultValues={editingRuleset ?? undefined}
      />
    </div>
  );
}
