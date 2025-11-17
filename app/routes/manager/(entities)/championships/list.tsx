import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
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
        <Link to="/hinterhof/turniere/neu">
          <Button variant="primary">
            <PlusIcon className="size-5" />
            Neues Turnier
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-default bg-raised overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default bg-subtle">
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Kennung
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Nr
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-secondary">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {championships.map((championship) => (
              <tr
                key={championship.id}
                className="border-b border-default last:border-0"
              >
                <td className="px-4 py-3 text-sm text-primary">
                  {championship.id}
                </td>
                <td className="px-4 py-3 text-sm text-primary">
                  {championship.name}
                </td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {championship.nr}
                </td>
                <td className="px-4 py-3 text-sm text-secondary">
                  {championship.published ? "Veröffentlicht" : "Entwurf"}
                  {championship.completed ? " • Abgeschlossen" : ""}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/hinterhof/${championship.id}`}>
                    <Button variant="ghost">Auswählen</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
