import type React from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UsersIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { getSession } from "@/lib/auth/session";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const sessionId = headerStore.get("x-session-id");

  if (!sessionId) redirect("/login");

  const session = await getSession(sessionId);

  if (!session?.user) redirect("/login");
  return (
    <div className="flex min-h-svh">
      <aside className="border-input fixed inset-y-0 left-0 flex w-64 flex-col overflow-y-auto border-r">
        <div className="border-input flex h-14 shrink-0 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-subtle mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
            Stammdaten
          </p>
          <Link
            href="/manager/stammdaten/spieler"
            className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <UsersIcon size={14} />
            Spieler
          </Link>
        </nav>
      </aside>
      <main className="ml-64 flex-1 px-6 py-3">{children}</main>
    </div>
  );
}
