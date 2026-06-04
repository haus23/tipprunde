import { leagues } from "@tipprunde/db/schema";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "react-aria-components";
import * as v from "valibot";

import { LigaDialog } from "#/components/liga-dialog.tsx";
import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);

  return (
    <div className="p-8">
      <title>Ligen | Stammdaten</title>
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
          {leagueList.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle py-16 text-center">
                Noch keine Ligen angelegt.
              </td>
            </tr>
          ) : (
            leagueList.map((league) => (
              <tr
                key={league.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3 font-medium">{league.shortName}</td>
                <td className="text-subtle px-3 py-3">{league.name}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => setEditingLeague(league)}
                    aria-label={`${league.name} bearbeiten`}
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

      <LigaDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <LigaDialog
        isOpen={!!editingLeague}
        onOpenChange={(open) => !open && setEditingLeague(null)}
        defaultValues={editingLeague ?? undefined}
      />
    </div>
  );
}
