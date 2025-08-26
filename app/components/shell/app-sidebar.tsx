import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { Link, NavLink } from "~/components/ui/link";
import { Logo } from "./logo";
import { useShell } from "./app-shell";

const fohNavItems = [
  { route: "/", label: "Tabelle", icon: TableIcon },
  { route: "/spieler", label: "Spieler", icon: UsersIcon },
  { route: "/spiele", label: "Spiele", icon: DicesIcon },
];

function HomeLink() {
  const { closeMobileNav } = useShell();

  return (
    <Link to="/" className="font-semibold" onClick={closeMobileNav}>
      <Logo className="size-10 flex-shrink-0" />
      <span className="text-lg font-medium tracking-wide">runde.tips</span>
    </Link>
  );
}

function NavItems() {
  const { closeMobileNav } = useShell();

  return (
    <>
      {fohNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.label} to={item.route} onClick={closeMobileNav}>
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </>
  );
}

export function AppSidebar() {
  const { isMobileNavOpen, closeMobileNav } = useShell();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 bg-gray-50 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="p-2">
          <HomeLink />
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
        <nav className="flex flex-col gap-1.5 px-2 py-4">
          <NavItems />
        </nav>
      </aside>

      {/* Mobile Navigation Modal */}
      <ModalOverlay
        isOpen={isMobileNavOpen}
        onOpenChange={closeMobileNav}
        isDismissable
        className="fixed inset-0 z-40 bg-black/50"
      >
        <Modal>
          <Dialog className="fixed inset-y-0 left-0 w-56 bg-white z-50 flex flex-col shadow-xl dark:bg-gray-900">
            <div className="p-2">
              <HomeLink />
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <nav className="flex flex-col gap-1.5 px-2 py-4">
              <NavItems />
            </nav>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
