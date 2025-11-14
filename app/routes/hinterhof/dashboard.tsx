import {
  FolderPlusIcon,
  UsersIcon,
  CalendarIcon,
  TrophyIcon,
  SettingsIcon,
  BarChartIcon,
  MailIcon,
} from "lucide-react";
import { Link } from "~/components/ui/link";

export default function DashboardRoute() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-8 text-primary">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/hinterhof/turniere/neu"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-1 p-3 transition-colors group-hover/card:bg-teaser-1-hover">
              <FolderPlusIcon className="size-6 text-teaser-1" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-1 transition-colors">
                Neues Tippturnier
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Erstelle eine neue Runde für deine Spieler
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-2 p-3 transition-colors group-hover/card:bg-teaser-2-hover">
              <UsersIcon className="size-6 text-teaser-2" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-2 transition-colors">
                Spieler verwalten
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Verwalte Teilnehmer und deren Berechtigungen
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-3 p-3 transition-colors group-hover/card:bg-teaser-3-hover">
              <CalendarIcon className="size-6 text-teaser-3" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-3 transition-colors">
                Spieltage planen
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Erstelle und bearbeite Spieltage und Matches
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-4 p-3 transition-colors group-hover/card:bg-teaser-4-hover">
              <TrophyIcon className="size-6 text-teaser-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-4 transition-colors">
                Rangliste anzeigen
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Zeige die aktuellen Platzierungen aller Spieler
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-5 p-3 transition-colors group-hover/card:bg-teaser-5-hover">
              <SettingsIcon className="size-6 text-teaser-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-5 transition-colors">
                Einstellungen
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Konfiguriere Regeln und Turnier-Parameter
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-6 p-3 transition-colors group-hover/card:bg-teaser-6-hover">
              <BarChartIcon className="size-6 text-teaser-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-6 transition-colors">
                Statistiken
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Analysiere Trends und Tipp-Genauigkeit
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="#"
          className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-teaser-7 p-3 transition-colors group-hover/card:bg-teaser-7-hover">
              <MailIcon className="size-6 text-teaser-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary group-hover/card:text-teaser-7 transition-colors">
                Benachrichtigungen
              </h2>
              <p className="mt-1 text-sm text-secondary">
                Versende Erinnerungen an deine Spieler
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
