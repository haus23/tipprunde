import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "react-router";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { Logo } from "./logo";
import { useShell } from "./app-shell";

const fohNavItems = [
  { route: "/", label: "Tabelle", icon: TableIcon },
  { route: "/spieler", label: "Spieler", icon: UsersIcon },
  { route: "/spiele", label: "Spiele", icon: DicesIcon },
];

function HomeLink() {
  return (
    <NavLink
      to="/"
      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-semibold transition-colors text-gray-700 hover:bg-gray-100"
    >
      <Logo className="size-6 flex-shrink-0" />
      <span>runde.tips</span>
    </NavLink>
  );
}

function NavItems() {
  return (
    <>
      {fohNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.route}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
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
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-50 border-r border-gray-200 ">
        <div className="p-4">
          <HomeLink />
        </div>
        <hr className="border-gray-200" />
        <nav className="flex flex-col space-y-1 p-4">
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
          <Dialog className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-xl">
            <div className="p-4">
              <HomeLink />
            </div>
            <hr className="border-gray-200" />
            <nav className="flex flex-col space-y-1 p-4">
              <NavItems />
            </nav>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
