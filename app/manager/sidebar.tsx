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

interface Props {
  currentSlug?: string;
  currentName?: string;
}

export function Sidebar({ currentSlug, currentName }: Props) {
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
      <div className="border-input flex h-10 shrink-0 items-center border-b px-4">
        <span className="text-subtle truncate text-sm">{currentName ?? "Manager"}</span>
      </div>
      <nav className="flex flex-1 flex-col p-4">
        {currentSlug && (
          <>
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
