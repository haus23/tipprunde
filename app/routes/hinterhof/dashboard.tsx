import { Link } from "react-router";
import { FolderPlusIcon } from "lucide-react";

export default function DashboardRoute() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-8 text-primary">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/hinterhof/turniere/neu"
          className="group relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">
              <FolderPlusIcon className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover:text-blue-600 transition-colors">
                Neues Tippturnier
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Erstelle eine neue Runde für deine Spieler
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
