import { users } from "@tipprunde/db/schema";
import { Button, SearchField } from "@tipprunde/ui";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/valibot";
import { LogOutIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { data } from "react-router";
import * as v from "valibot";

import { SpielerDialog } from "#/components/spieler-dialog.tsx";
import { logAuthEvent } from "#/lib/auth-events.server.ts";
import { userContext } from "#/lib/context.ts";
import { db } from "#/lib/db.server.ts";
import { getSessionFromRequest, isAdmin, revokeUserSessions } from "#/lib/session.server.ts";
import { sortGerman } from "#/lib/utils.ts";

import type { Route } from "./+types/spieler";
import { SessionsDialog } from "./_sessions-dialog.tsx";

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

export async function loader({ context }: Route.LoaderArgs) {
  const rows = await db.query.users.findMany();
  return {
    users: sortGerman(rows, (u) => u.name),
    // Gates the "Sitzungen beenden" button — the action re-checks this itself,
    // this only decides whether it renders at all.
    canRevokeSessions: isAdmin(context.get(userContext)),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = v.parse(
    v.picklist(["create", "update", "revoke-sessions"]),
    formData.get("intent"),
  );

  if (intent === "revoke-sessions") {
    if (!isAdmin(context.get(userContext))) {
      throw data("Nur für Admins.", { status: 403 });
    }
    const id = Number(formData.get("userId"));
    const target = await db.query.users.findFirst({ where: { id } });
    if (!target) return { errors: { revoke: ["Spieler nicht gefunden."] } };

    const session = await getSessionFromRequest(request);
    const count = await revokeUserSessions(id, session.get("sessionId"));

    // Nothing to log when nothing happened — an admin action that changed
    // zero rows is not worth the same audit weight as one that actually
    // ended a session.
    if (count > 0) {
      await logAuthEvent({
        type: "sessions_revoked",
        userId: id,
        email: target.email,
        detail: `Manuell beendet durch ${context.get(userContext)?.name ?? "unbekannt"}`,
      });
    }
    return { revoked: true, count };
  }

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
      await logAuthEvent({
        type: "sessions_revoked",
        userId: id,
        // The new address, so the log reads as "this account is reachable here
        // now". The old one is not kept — it is exactly the kind of trace the
        // change was meant to end.
        email: values.email,
        detail: `Adresse geändert durch ${context.get(userContext)?.name ?? "unbekannt"}`,
      });
    }

    return { user };
  }

  return null;
}

export default function Spieler({ loaderData }: Route.ComponentProps) {
  const { users: userList, canRevokeSessions } = loaderData;
  const [filter, setFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sessionsUser, setSessionsUser] = useState<User | null>(null);

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
            {/* Both drop out below xs: the fixed widths alone (224 + 112 + 96)
                already exceed a 375px screen. The address is not lost — the
                edit dialog shows it, which is where a change request ends up
                anyway. */}
            <th className="border-subtle text-muted xs:table-cell hidden w-56 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              E-Mail
            </th>
            <th className="border-subtle text-muted xs:table-cell hidden w-28 border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Rolle
            </th>
            {/* Wide enough for two icon buttons once the session action joins
                the pencil — sized for admins, who see both; a plain manager's
                row just carries the unused space. */}
            <th className="border-subtle w-24 border-b" />
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
                  <div className="flex justify-end gap-1">
                    {/* Without an address there is no login path at all, and
                        clearing one already revokes whatever existed — so no
                        email means provably no session to end. */}
                    {canRevokeSessions && user.email && (
                      <Button
                        intent="ghost"
                        size="icon"
                        onPress={() => setSessionsUser(user)}
                        aria-label={`Sitzungen von ${user.name} beenden`}
                        // 4px from the edit button — cap the facing side so
                        // the expanded hit areas meet, not overlap.
                        className="-mr-0.5 pr-2"
                      >
                        <LogOutIcon className="size-4" />
                      </Button>
                    )}
                    <Button
                      intent="ghost"
                      size="icon"
                      onPress={() => setEditingUser(user)}
                      aria-label={`${user.name} bearbeiten`}
                      className={canRevokeSessions && user.email ? "-ml-0.5 pl-2" : undefined}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
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

      {sessionsUser && (
        <SessionsDialog
          isOpen={!!sessionsUser}
          onOpenChange={(open) => !open && setSessionsUser(null)}
          userId={sessionsUser.id}
          name={sessionsUser.name}
        />
      )}
    </div>
  );
}
