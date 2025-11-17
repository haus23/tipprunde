import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { PlayerForm } from "~/components/manager/player-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getUsers } from "~/lib/db/users";
import type { Route } from "./+types/list";

export async function loader() {
  const users = getUsers();
  return { users };
}

export default function PlayersRoute({ loaderData }: Route.ComponentProps) {
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
                onCancel={() => setIsDialogOpen(false)}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </DialogOverlay>
        </DialogTrigger>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead align="right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-primary">{user.name}</TableCell>
                <TableCell className="text-secondary">
                  {user.email ?? "—"}
                </TableCell>
                <TableCell className="text-secondary">{user.role}</TableCell>
                <TableCell align="right">
                  <Button variant="ghost">Bearbeiten</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
