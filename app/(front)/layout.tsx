import type React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-input fixed inset-x-0 top-0 h-14 border-b px-4">
        <nav className="flex h-full items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
        </nav>
      </header>
      <div className="flex flex-1 flex-col pt-14">{children}</div>
    </div>
  );
}
