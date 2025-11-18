import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { LeagueForm } from "~/components/manager/league-form";
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
import { getLeagues } from "~/lib/db/leagues";
import type { Route } from "./+types/list";

export async function loader() {
  const leagues = getLeagues();
  return { leagues };
}

export default function LeaguesRoute({ loaderData }: Route.ComponentProps) {
  const { leagues } = loaderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-primary">Ligen</h1>
        <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button variant="primary">
            <PlusIcon className="size-5" />
            Neue Liga
          </Button>
          <DialogOverlay>
            <Dialog>
              <DialogTitle className="text-xl font-semibold text-primary">
                Neue Liga
              </DialogTitle>
              <LeagueForm
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
            {leagues.map((league) => (
              <TableRow key={league.id}>
                <TableCell className="text-primary">{league.id}</TableCell>
                <TableCell className="text-primary">{league.name}</TableCell>
                <TableCell className="text-secondary">
                  {league.shortname ?? "—"}
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
