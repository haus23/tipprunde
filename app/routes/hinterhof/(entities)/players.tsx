import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { data, redirect } from "react-router";
import { PlayerForm } from "~/components/hinterhof/player-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { createUser, getUsers } from "~/lib/db/users";
import type { Route } from "./+types/players";

export async function loader() {
  const users = getUsers();

  return { users };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name")).trim();
  const slug = String(formData.get("slug")).trim();
  const email = String(formData.get("email") || "").trim() || null;

  // Validation
  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = "Name ist erforderlich";
  }
  if (!slug) {
    errors.slug = "Slug ist erforderlich";
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  createUser({ name, slug, email, role: "USER" });

  throw redirect("/hinterhof/spieler");
}

export default function PlayersRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { users } = loaderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-primary">Spieler</h1>
        <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button variant="primary">
            <PlusIcon className="size-5" />
            Neuer Spieler
          </Button>
          <DialogOverlay>
            <Dialog>
              <DialogTitle className="text-xl font-semibold text-primary">
                Neuer Spieler
              </DialogTitle>
              <PlayerForm
                errors={actionData?.errors}
                onCancel={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </DialogOverlay>
        </DialogTrigger>
      </div>

      <div className="rounded-lg border border-default bg-raised overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default bg-subtle">
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                E-Mail
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Rolle
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-secondary">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-default last:border-0"
              >
                <td className="px-4 py-3 text-sm text-primary">{user.name}</td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {user.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {user.role}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost">Bearbeiten</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
