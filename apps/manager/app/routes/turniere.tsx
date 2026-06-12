import { championships } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as v from "valibot";

import { TurnierDialog } from "#/components/turnier-dialog.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/turniere";

type Championship = typeof championships.$inferSelect;
type ChampionshipWithRuleset = Championship & { ruleset: { name: string } | null };

export const handle = { title: "Stammdaten | Turniere" };

const championshipSchema = createInsertSchema(championships, {
  id: v.optional(v.pipe(v.string(), v.toNumber(), v.integer())),
  name: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Name ist erforderlich")),
  slug: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kennung ist erforderlich")),
  nr: v.pipe(
    v.string(),
    v.toNumber(),
    v.integer("Muss eine ganze Zahl sein"),
    v.minValue(1, "Muss mindestens 1 sein"),
  ),
  rulesetId: (schema) => v.pipe(schema, v.nonEmpty("Bitte ein Regelwerk wählen")),
});

export async function loader() {
  const [data, rulesetList] = await Promise.all([
    db.query.championships.findMany({
      orderBy: { nr: "desc" },
      with: { ruleset: { columns: { name: true } } },
    }),
    db.query.rulesets.findMany({ orderBy: { name: "asc" } }),
  ]);

  return {
    championships: data,
    rulesets: rulesetList,
    nextNr: (data[0]?.nr ?? 0) + 1,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(v.picklist(["create", "update"]), formData.get("intent"));

  const result = v.safeParse(championshipSchema, Object.fromEntries(formData));

  if (!result.success) {
    return { errors: v.flatten(result.issues).nested ?? {} };
  }

  if (intent === "create") {
    const [nrConflict, slugConflict] = await Promise.all([
      db.query.championships.findFirst({ where: { nr: result.output.nr } }),
      db.query.championships.findFirst({ where: { slug: result.output.slug } }),
    ]);
    const conflicts: Record<string, string[]> = {};
    if (nrConflict) conflicts.nr = ["Diese Nummer ist bereits vergeben"];
    if (slugConflict) conflicts.slug = ["Diese Kennung ist bereits vergeben"];
    if (Object.keys(conflicts).length) return { errors: conflicts };

    const [championship] = await db.insert(championships).values(result.output).returning();
    return { championship };
  }

  if (intent === "update" && result.output.id) {
    const [championship] = await db
      .update(championships)
      .set(result.output)
      .where(eq(championships.id, result.output.id))
      .returning();
    return { championship };
  }

  return null;
}

export default function Turniere({ loaderData }: Route.ComponentProps) {
  const { championships: championshipList, rulesets: rulesetList, nextNr } = loaderData;
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChampionship, setEditingChampionship] = useState<ChampionshipWithRuleset | null>(
    null,
  );

  const filtered = championshipList.filter(
    (c) => !filter || `${c.name} ${c.slug}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-8">
      <title>Turniere | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between gap-4">
        <SearchField
          aria-label="Turniere filtern"
          className="flex-1"
          value={filter}
          onChange={setFilter}
        />
        <Button onPress={() => setIsCreateOpen(true)}>
          <PlusIcon className="size-4" />
          Neues Turnier
        </Button>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-subtle text-muted w-16 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              #
            </th>
            <th className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Name
            </th>
            <th className="border-subtle text-muted w-48 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Regelwerk
            </th>
            <th className="border-subtle w-12 border-b" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-subtle py-16 text-center">
                {filter ? "Keine Ergebnisse." : "Noch keine Turniere angelegt."}
              </td>
            </tr>
          ) : (
            filtered.map((championship) => (
              <tr
                key={championship.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="text-muted px-3 py-3 font-mono text-sm">{championship.nr}</td>
                <td className="px-3 py-3">
                  <div className="font-medium">{championship.name}</div>
                  <div className="text-subtle font-mono text-xs">{championship.slug}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-subtle truncate text-sm">{championship.ruleset?.name}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => setEditingChampionship(championship)}
                    aria-label={`${championship.name} bearbeiten`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TurnierDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        rulesets={rulesetList}
        nextNr={nextNr}
        onSuccess={(championship) => navigate(`/${championship.slug}`)}
      />

      <TurnierDialog
        isOpen={!!editingChampionship}
        onOpenChange={(open) => !open && setEditingChampionship(null)}
        defaultValues={editingChampionship ?? undefined}
        rulesets={rulesetList}
      />
    </div>
  );
}
