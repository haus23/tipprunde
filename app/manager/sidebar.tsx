import Link from "next/link";
import {
  CalendarIcon,
  DicesIcon,
  FoldersIcon,
  LayoutDashboardIcon,
  PilcrowIcon,
  ScaleIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ChampionshipSwitcher } from "./championship-switcher";
import type { championships } from "@/lib/db/schema";

type Championship = typeof championships.$inferSelect;

interface Props {
  currentSlug?: string;
  currentName?: string;
  championships: Championship[];
}

export function Sidebar({ currentSlug, currentName, championships }: Props) {
  return (
    <aside className="border-input fixed inset-y-0 left-0 hidden w-52 flex-col overflow-y-auto border-r md:flex">
      <div className="border-input flex h-14 shrink-0 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="size-10">
            <Logo />
          </span>
          <span className="text-lg font-medium">runde.tips</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col p-4 pt-0">
        {currentSlug && (
          <>
            {championships.length > 1 ? (
              <div className="border-input -mx-4 mb-2 border-b px-2 py-1">
                <ChampionshipSwitcher currentName={currentName} championships={championships} />
              </div>
            ) : (
              <span className="text-subtle border-input -mx-4 mb-2 truncate border-b px-4 py-2 text-sm">
                {currentName}
              </span>
            )}
            <Link
              href={`/manager/${currentSlug}`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <LayoutDashboardIcon size={14} />
              Dashboard
            </Link>
            <Link
              href={`/manager/${currentSlug}/turnier`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <TrophyIcon size={14} />
              Turnier
            </Link>
            <Link
              href={`/manager/${currentSlug}/spiele`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <CalendarIcon size={14} />
              Spiele
            </Link>
            <Link
              href={`/manager/${currentSlug}/tipps`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <DicesIcon size={14} />
              Tipps
            </Link>
            <Link
              href={`/manager/${currentSlug}/ergebnisse`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <ScaleIcon size={14} />
              Ergebnisse
            </Link>
            <Link
              href={`/manager/${currentSlug}/zusatzpunkte`}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <StarIcon size={14} />
              Zusatzpunkte
            </Link>
          </>
        )}

        <div className="mt-auto">
          <p className="text-subtle mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
            Stammdaten
          </p>
          <Link
            href="/manager/stammdaten/turniere"
            className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <FoldersIcon size={14} />
            Turniere
          </Link>
          <Link
            href="/manager/stammdaten/spieler"
            className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <UsersIcon size={14} />
            Spieler
          </Link>
          <Link
            href="/manager/stammdaten/regelwerke"
            className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <PilcrowIcon size={14} />
            Regelwerke
          </Link>
        </div>
      </nav>
    </aside>
  );
}
