import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { Logo } from "./logo";
import { useShell } from "./provider";

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const { isMobileMenuOpen, toggleMobileMenu } = useShell();

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <div className="fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col gap-1 border-r border-default bg-raised pb-2 overflow-y-auto md:hidden">
        <div className="px-2 py-1 flex items-center justify-between sticky top-0 bg-raised z-10">
          <Link
            to="/"
            className="flex items-center px-0.5 gap-1 overflow-hidden"
            onClick={toggleMobileMenu}
          >
            <Logo className="size-8 shrink-0" />
            <span className="text-xl font-medium">runde.tips</span>
          </Link>
          <Button variant="ghost" onClick={toggleMobileMenu} className="shrink-0">
            <XIcon className="size-5" />
          </Button>
        </div>
        <div className="grow flex flex-col" onClick={toggleMobileMenu}>
          {children}
        </div>
      </div>
    </>
  );
}
