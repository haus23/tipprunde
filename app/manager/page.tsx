import type { LucideIcon } from "lucide-react";
import { FolderPlusIcon } from "lucide-react";
import Link from "next/link";

type TeaserColor = 1 | 2 | 3 | 4 | 5 | 6;

type ActionCard = {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  teaserColor: TeaserColor;
};

const actionCards: ActionCard[] = [
  {
    to: "/manager/turnier/neu",
    icon: FolderPlusIcon,
    title: "Neues Turnier",
    description: "Erstelle eine neue Tipprunde für deine Spieler",
    teaserColor: 1,
  },
];

const teaserClasses: Record<TeaserColor, { bg: string; bgHover: string; text: string }> = {
  1: { bg: "bg-teaser-1", bgHover: "hover:bg-teaser-1-hover", text: "text-teaser-1" },
  2: { bg: "bg-teaser-2", bgHover: "hover:bg-teaser-2-hover", text: "text-teaser-2" },
  3: { bg: "bg-teaser-3", bgHover: "hover:bg-teaser-3-hover", text: "text-teaser-3" },
  4: { bg: "bg-teaser-4", bgHover: "hover:bg-teaser-4-hover", text: "text-teaser-4" },
  5: { bg: "bg-teaser-5", bgHover: "hover:bg-teaser-5-hover", text: "text-teaser-5" },
  6: { bg: "bg-teaser-6", bgHover: "hover:bg-teaser-6-hover", text: "text-teaser-6" },
};

export default function ManagerDashboard() {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="mb-6 text-2xl font-medium">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actionCards.map((card) => {
          const Icon = card.icon;
          const teaser = teaserClasses[card.teaserColor];
          return (
            <Link
              key={card.title}
              href={card.to}
              className={`${teaser.bg} ${teaser.bgHover} overflow-hidden rounded-lg border border-transparent p-6 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-4">
                <Icon className={`${teaser.text} size-6 shrink-0`} />
                <div className="flex-1">
                  <h2 className={`${teaser.text} text-lg font-semibold`}>
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm opacity-70">{card.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
