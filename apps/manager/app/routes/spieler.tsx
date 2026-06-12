import { users } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";

import { SpielerDialog } from "#/components/spieler-dialog.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/spieler";

type User = typeof users.$inferSelect;

export const handle = { title: "Stammdaten | Spieler" };

const roleLabels: Record<User["role"], string> = {
  user: "Spieler",
  manager: "Manager",
  admin: "Admin",
};

const spielerSchema = createInsertSchema(users, {
  id: v.optional(v.pipe(v.string(), v.toNumber(), v.integer())),
  name: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Name ist erforderlich")),
  slug: (schema) => v.pipe(schema, v.trim(), v.nonEmpty("Kennung ist erforderlich")),
  email: v.pipe(
    v.optional(v.string()),
    v.transform((v) => v?.trim() || undefined),
    v.optional(v.pipe(v.string(), v.email("Keine gültige E-Mail-Adresse"))),
  ),
  role: v.picklist(["user", "manager", "admin"]),
});

export async function loader() {
  const data = await db.query.users.findMany({ orderBy: { name: "asc" } });
  return { users: data };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(v.picklist(["create", "update"]), formData.get("intent"));

  const result = v.safeParse(spielerSchema, Object.fromEntries(formData));

  if (!result.success) {
    return { errors: v.flatten(result.issues).nested ?? {} };
  }

  const { id, ...values } = result.output;

  if (intent === "create") {
    const [slugConflict, emailConflict] = await Promise.all([
      db.query.users.findFirst({ where: { slug: result.output.slug } }),
      values.email
        ? db.query.users.findFirst({ where: { email: values.email } })
        : Promise.resolve(null),
    ]);
    const conflicts: Record<string, string[]> = {};
    if (slugConflict) conflicts.slug = ["Diese Kennung ist bereits vergeben"];
    if (emailConflict) conflicts.email = ["Diese E-Mail ist bereits vergeben"];
    if (Object.keys(conflicts).length) return { errors: conflicts };

    const [user] = await db.insert(users).values(values).returning();
    return { user };
  }

  if (intent === "update" && id) {
    const [user] = await db.update(users).set(values).where(eq(users.id, id)).returning();
    return { user };
  }

  return null;
}

export default function Spieler({ loaderData }: Route.ComponentProps) {
  const { users: userList } = loaderData;
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filtered = userList.filter(
    (u) => !filter || `${u.name} ${u.slug}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-8">
      <title>Spieler | Stammdaten</title>
      <div className="mb-6 flex min-h-9 items-center justify-between gap-4">
        <SearchField
          aria-label="Spieler filtern"
          className="flex-1"
          value={filter}
          onChange={setFilter}
        />
        <Button onPress={() => setIsCreateOpen(true)}>
          <PlusIcon className="size-4" />
          Neuer Spieler
        </Button>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Name
            </th>
            <th className="border-subtle text-muted w-56 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              E-Mail
            </th>
            <th className="border-subtle text-muted w-28 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Rolle
            </th>
            <th className="border-subtle w-12 border-b" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-subtle py-16 text-center">
                {filter ? "Keine Ergebnisse." : "Noch keine Spieler angelegt."}
              </td>
            </tr>
          ) : (
            filtered.map((user) => (
              <tr
                key={user.id}
                className="border-subtle hover:bg-surface-raised border-b transition-colors last:border-0"
              >
                <td className="px-3 py-3">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-subtle font-mono text-xs">{user.slug}</div>
                </td>
                <td className="text-subtle px-3 py-3">{user.email}</td>
                <td className="text-subtle px-3 py-3">{roleLabels[user.role]}</td>
                <td className="px-3 py-3 text-right">
                  <Button
                    intent="ghost"
                    size="icon"
                    onPress={() => setEditingUser(user)}
                    aria-label={`${user.name} bearbeiten`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <SpielerDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(user) => setFilter(user.name)}
      />

      <SpielerDialog
        isOpen={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        defaultValues={editingUser ?? undefined}
      />
    </div>
  );
}
