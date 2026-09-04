import { users } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/valibot";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";

import { SpielerDialog } from "#/components/spieler-dialog.tsx";
import { db } from "#/lib/db.server.ts";
import { getSessionFromRequest, revokeUserSessions } from "#/lib/session.server.ts";

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
  // Empty has to land as null, not undefined: Drizzle reads undefined in
  // `.set()` as "leave this column alone", so clearing an address silently
  // kept the old one. Every other optional field in the manager is built by
  // hand with `|| null` — this one goes through a schema, which is how it
  // came to differ.
  email: v.pipe(
    v.optional(v.string()),
    v.transform((value) => value?.trim() || null),
    v.nullable(v.pipe(v.string(), v.email("Keine gültige E-Mail-Adresse"))),
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
    const existing = await db.query.users.findFirst({ where: { id } });
    if (!existing) return null;

    // Both columns are unique in the database. Without this the constraint
    // decides, which surfaces as an unhandled error instead of a message on
    // the field. Excluding the row itself, or saving a player unchanged would
    // collide with their own values.
    const [slugConflict, emailConflict] = await Promise.all([
      db.query.users.findFirst({ where: { slug: values.slug, id: { ne: id } } }),
      values.email
        ? db.query.users.findFirst({ where: { email: values.email, id: { ne: id } } })
        : Promise.resolve(null),
    ]);
    const conflicts: Record<string, string[]> = {};
    if (slugConflict) conflicts.slug = ["Diese Kennung ist bereits vergeben"];
    if (emailConflict) conflicts.email = ["Diese E-Mail ist bereits vergeben"];
    if (Object.keys(conflicts).length) return { errors: conflicts };

    const [user] = await db.update(users).set(values).where(eq(users.id, id)).returning();

    // Only the address is a credential; name, slug and role are not. A role
    // change needs no help here either — getSessionUser reads it fresh from
    // the database on every request, so a demotion already takes effect at once.
    if (existing.email !== values.email) {
      const session = await getSessionFromRequest(request);
      await revokeUserSessions(id, session.get("sessionId"));
    }

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
    <div>
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
            {/* Both drop out below xs: the fixed widths alone (224 + 112 + 48)
                already exceed a 375px screen. The address is not lost — the
                edit dialog shows it, which is where a change request ends up
                anyway. */}
            <th className="border-subtle text-muted xs:table-cell hidden w-56 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              E-Mail
            </th>
            <th className="border-subtle text-muted xs:table-cell hidden w-28 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
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
                <td className="text-subtle xs:table-cell hidden px-3 py-3">{user.email}</td>
                <td className="text-subtle xs:table-cell hidden px-3 py-3">
                  {roleLabels[user.role]}
                </td>
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
