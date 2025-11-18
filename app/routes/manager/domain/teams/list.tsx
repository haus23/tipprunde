import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { TeamForm } from "~/components/manager/team-form";
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
import { getTeams } from "~/lib/db/teams";
import type { Route } from "./+types/list";

export async function loader() {
  const teams = getTeams();
  return { teams };
}

export default function TeamsRoute({ loaderData }: Route.ComponentProps) {
  const { teams } = loaderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-primary">Teams</h1>
        <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button variant="primary">
            <PlusIcon className="size-5" />
            Neues Team
          </Button>
          <DialogOverlay>
            <Dialog>
              <DialogTitle className="text-xl font-semibold text-primary">
                Neues Team
              </DialogTitle>
              <TeamForm
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
              <TableHead>Kennung</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kurzname</TableHead>
              <TableHead align="right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="text-primary">{team.id}</TableCell>
                <TableCell className="text-primary">{team.name}</TableCell>
                <TableCell className="text-secondary">
                  {team.shortname ?? "—"}
                </TableCell>
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
