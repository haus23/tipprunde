import { PlusIcon } from "lucide-react";
import { Link } from "~/components/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getChampionships } from "~/lib/db/championships";
import type { Route } from "./+types/list";

export async function loader() {
  const championships = getChampionships();
  return { championships };
}

export default function ChampionshipsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { championships } = loaderData;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-primary">Tippturniere</h1>
        <Link
          to="/hinterhof/stammdaten/turniere/neu"
          className="flex items-center px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <PlusIcon className="size-5" />
          Neues Turnier
        </Link>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>Kennung</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nr</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {championships.map((championship) => (
              <TableRow key={championship.id}>
                <TableCell className="text-primary">
                  {championship.id}
                </TableCell>
                <TableCell className="text-primary">
                  {championship.name}
                </TableCell>
                <TableCell className="text-secondary">
                  {championship.nr}
                </TableCell>
                <TableCell className="text-secondary">
                  {championship.published ? "Veröffentlicht" : "Entwurf"}
                  {championship.completed ? " • Abgeschlossen" : ""}
                </TableCell>
                <TableCell align="right">
                  <Link
                    to={`/hinterhof/${championship.id}`}
                    className="p-1 rounded-md text-secondary hover:text-primary hover:bg-raised-hover"
                  >
                    Auswählen
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
