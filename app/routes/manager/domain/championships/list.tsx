import { PlusIcon } from "lucide-react";
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
        <Link
          to="/hinterhof/stammdaten/turniere/neu"
          className="flex items-center px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <PlusIcon className="size-5" />
          Neues Turnier
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
                  <Link
                    to={`/hinterhof/${championship.id}`}
                    className="p-1 rounded-md text-secondary hover:text-primary hover:bg-raised-hover"
                  >
                    Auswählen
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
