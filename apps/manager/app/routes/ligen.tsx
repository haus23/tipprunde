import { leagues } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";

import { LigaDialog } from "#/components/liga-dialog.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/ligen";

type League = typeof leagues.$inferSelect;

export const handle = { title: "Stammdaten | Ligen" };

const leagueSchema = createInsertSchema(leagues, {
  id: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kennung ist erforderlich")),
  name: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Name ist erforderlich")),
  shortName: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kurzname ist erforderlich")),
});

export async function loader() {
  const data = await db.query.leagues.findMany({ orderBy: { shortName: "asc" } });
  return { leagues: data };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(v.picklist(["create", "update"]), formData.get("intent"));

  const result = v.safeParse(leagueSchema, Object.fromEntries(formData));

  if (!result.success) {
    return { errors: v.flatten(result.issues).nested ?? {} };
  }

  const { id, ...values } = result.output;

  if (intent === "create") {
    const existing = await db.query.leagues.findFirst({ where: { id } });
    if (existing) {
      return { errors: { id: ["Diese Kennung ist bereits vergeben"] } };
    }
  }

  await db.insert(leagues).values(result.output).onConflictDoUpdate({
    target: leagues.id,
    set: values,
  });
  return { league: result.output };
}

export default function Ligen({ loaderData }: Route.ComponentProps) {
  const { leagues: leagueList } = loaderData;
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);

  const filtered = leagueList.filter(
    (l) => !filter || `${l.name} ${l.shortName}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-8">
      <title>Ligen | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between gap-4">
        <SearchField
          aria-label="Ligen filtern"
          className="flex-1"
          value={filter}
          onChange={setFilter}
        />
        <Button onPress={() => setIsCreateOpen(true)}>
          <PlusIcon className="size-4" />
          Neue Liga
        </Button>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-subtle text-muted w-32 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Kurzname
            </th>
            <th className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Name
            </th>
            <th className="border-subtle w-12 border-b" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle py-16 text-center">
                {filter ? "Keine Ergebnisse." : "Noch keine Ligen angelegt."}
              </td>
            </tr>
          ) : (
            filtered.map((league) => (
              <tr
                key={league.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3 font-medium">{league.shortName}</td>
                <td className="text-subtle px-3 py-3">{league.name}</td>
                <td className="px-3 py-3 text-right">
                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => setEditingLeague(league)}
                    aria-label={`${league.name} bearbeiten`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <LigaDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(league) => setFilter(league.shortName)}
      />

      <LigaDialog
        isOpen={!!editingLeague}
        onOpenChange={(open) => !open && setEditingLeague(null)}
        defaultValues={editingLeague ?? undefined}
      />
    </div>
  );
}
