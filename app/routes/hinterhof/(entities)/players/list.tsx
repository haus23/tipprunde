import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { PlayerForm } from "~/components/hinterhof/player-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getUsers } from "~/lib/db/users";
import type { Route } from "./+types/list";

export async function loader() {
  const users = getUsers();

  return { users };
}

export default function PlayersRoute({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fetcher = useFetcher();
  const prevStateRef = useRef(fetcher.state);

  // Close dialog after successful submission
  useEffect(() => {
    // Only close if we just transitioned to idle with success
    if (
      prevStateRef.current !== "idle" &&
      fetcher.state === "idle" &&
      fetcher.data?.success &&
      isDialogOpen
    ) {
      setIsDialogOpen(false);
    }
    prevStateRef.current = fetcher.state;
  }, [fetcher.state, fetcher.data, isDialogOpen]);

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
                fetcher={fetcher}
                action="/hinterhof/spieler/neu"
                errors={fetcher.data?.errors}
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
