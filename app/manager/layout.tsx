import type React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <aside className="border-input fixed inset-y-0 left-0 flex w-64 flex-col overflow-y-auto border-r">
        <div className="flex h-14 shrink-0 items-center border-b border-input px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">{/* nav items later */}</nav>
      </aside>
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
}
