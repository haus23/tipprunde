import type { LucideIcon } from "lucide-react";
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

type DashboardCard = {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  teaserColor: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

const dashboardCards: DashboardCard[] = [
  {
    to: "/hinterhof/stammdaten/turniere/neu",
    icon: FolderPlusIcon,
    title: "Neues Tippturnier",
    description: "Erstelle eine neue Runde für deine Spieler",
    teaserColor: 1,
  },
  {
    to: "#",
    icon: UsersIcon,
    title: "Spieler verwalten",
    description: "Verwalte Teilnehmer und deren Berechtigungen",
    teaserColor: 2,
  },
  {
    to: "#",
    icon: CalendarIcon,
    title: "Spieltage planen",
    description: "Erstelle und bearbeite Spieltage und Matches",
    teaserColor: 3,
  },
  {
    to: "#",
    icon: TrophyIcon,
    title: "Rangliste anzeigen",
    description: "Zeige die aktuellen Platzierungen aller Spieler",
    teaserColor: 4,
  },
  {
    to: "#",
    icon: SettingsIcon,
    title: "Einstellungen",
    description: "Konfiguriere Regeln und Turnier-Parameter",
    teaserColor: 5,
  },
  {
    to: "#",
    icon: BarChartIcon,
    title: "Statistiken",
    description: "Analysiere Trends und Tipp-Genauigkeit",
    teaserColor: 6,
  },
  {
    to: "#",
    icon: MailIcon,
    title: "Benachrichtigungen",
    description: "Versende Erinnerungen an deine Spieler",
    teaserColor: 7,
  },
];

function getTeaserClasses(color: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
  const classes = {
    1: {
      bg: "bg-teaser-1",
      bgHover: "group-hover/card:bg-teaser-1-hover",
      text: "text-teaser-1",
      textHover: "group-hover/card:text-teaser-1",
    },
    2: {
      bg: "bg-teaser-2",
      bgHover: "group-hover/card:bg-teaser-2-hover",
      text: "text-teaser-2",
      textHover: "group-hover/card:text-teaser-2",
    },
    3: {
      bg: "bg-teaser-3",
      bgHover: "group-hover/card:bg-teaser-3-hover",
      text: "text-teaser-3",
      textHover: "group-hover/card:text-teaser-3",
    },
    4: {
      bg: "bg-teaser-4",
      bgHover: "group-hover/card:bg-teaser-4-hover",
      text: "text-teaser-4",
      textHover: "group-hover/card:text-teaser-4",
    },
    5: {
      bg: "bg-teaser-5",
      bgHover: "group-hover/card:bg-teaser-5-hover",
      text: "text-teaser-5",
      textHover: "group-hover/card:text-teaser-5",
    },
    6: {
      bg: "bg-teaser-6",
      bgHover: "group-hover/card:bg-teaser-6-hover",
      text: "text-teaser-6",
      textHover: "group-hover/card:text-teaser-6",
    },
    7: {
      bg: "bg-teaser-7",
      bgHover: "group-hover/card:bg-teaser-7-hover",
      text: "text-teaser-7",
      textHover: "group-hover/card:text-teaser-7",
    },
    8: {
      bg: "bg-teaser-8",
      bgHover: "group-hover/card:bg-teaser-8-hover",
      text: "text-teaser-8",
      textHover: "group-hover/card:text-teaser-8",
    },
  };
  return classes[color];
}

export default function DashboardRoute() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const teaser = getTeaserClasses(card.teaserColor);

          return (
            <Link
              key={card.title}
              to={card.to}
              className="group/card relative overflow-hidden rounded-lg border border-default bg-raised p-6 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-lg ${teaser.bg} ${teaser.bgHover} p-3 transition-colors`}
                >
                  <Icon className={`size-6 ${teaser.text}`} />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-lg font-semibold text-primary ${teaser.textHover} transition-colors`}
                  >
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm text-secondary">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
