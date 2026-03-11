import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: { template: "%s | Manager", default: "Manager" },
};
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { CURRENT_CHAMPIONSHIP_COOKIE } from "@/proxy";
import { Sidebar } from "./sidebar";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const sessionId = headerStore.get("x-session-id");

  if (!sessionId) redirect("/login");

  const session = await getSession(sessionId);

  if (!session?.user) redirect("/login");

  const cookieStore = await cookies();
  const currentSlug = cookieStore.get(CURRENT_CHAMPIONSHIP_COOKIE)?.value;

  const [currentChampionship, championships] = await Promise.all([
    currentSlug
      ? db.query.championships.findFirst({ where: { slug: currentSlug } })
      : null,
    db.query.championships.findMany({ orderBy: { nr: "desc" } }),
  ]);

  return (
    <div className="flex min-h-svh">
      <Sidebar
        currentSlug={currentSlug}
        currentName={currentChampionship?.name}
        championships={championships}
      />
      <main className="flex-1 py-3 sm:px-6 md:ml-52">{children}</main>
    </div>
  );
}
