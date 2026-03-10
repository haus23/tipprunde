import type React from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
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

  return (
    <div className="flex min-h-svh">
      <Sidebar currentSlug={currentSlug} />
      <main className="flex-1 py-3 sm:px-6 md:ml-52">{children}</main>
    </div>
  );
}
