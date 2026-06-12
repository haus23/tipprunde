import { teams } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";

import { TeamDialog } from "#/components/team-dialog.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/teams";

type Team = typeof teams.$inferSelect;

export const handle = { title: "Stammdaten | Teams" };

const teamSchema = createInsertSchema(teams, {
  id: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kennung ist erforderlich")),
  name: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Name ist erforderlich")),
  shortName: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kurzname ist erforderlich")),
});

export async function loader() {
  const data = await db.query.teams.findMany({ orderBy: { shortName: "asc" } });
  return { teams: data };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(v.picklist(["create", "update"]), formData.get("intent"));

  const result = v.safeParse(teamSchema, Object.fromEntries(formData));

  if (!result.success) {
    return { errors: v.flatten(result.issues).nested ?? {} };
  }

  const { id, ...values } = result.output;

  if (intent === "create") {
    const existing = await db.query.teams.findFirst({ where: { id } });
    if (existing) {
      return { errors: { id: ["Diese Kennung ist bereits vergeben"] } };
    }
  }

  await db.insert(teams).values(result.output).onConflictDoUpdate({
    target: teams.id,
    set: values,
  });
  return { team: result.output };
}

export default function Teams({ loaderData }: Route.ComponentProps) {
  const { teams: teamList } = loaderData;
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filtered = teamList.filter(
    (t) => !filter || `${t.name} ${t.shortName}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-8">
      <title>Teams | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between gap-4">
        <SearchField
          aria-label="Teams filtern"
          className="flex-1"
          value={filter}
          onChange={setFilter}
        />
        <Button onPress={() => setIsCreateOpen(true)}>
          <PlusIcon className="size-4" />
          Neues Team
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
                {filter ? "Keine Ergebnisse." : "Noch keine Teams angelegt."}
              </td>
            </tr>
          ) : (
            filtered.map((team) => (
              <tr
                key={team.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3 font-medium">{team.shortName}</td>
                <td className="text-subtle px-3 py-3">{team.name}</td>
                <td className="px-3 py-3 text-right">
                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => setEditingTeam(team)}
                    aria-label={`${team.name} bearbeiten`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TeamDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(team) => setFilter(team.shortName)}
      />

      <TeamDialog
        isOpen={!!editingTeam}
        onOpenChange={(open) => !open && setEditingTeam(null)}
        defaultValues={editingTeam ?? undefined}
      />
    </div>
  );
}
