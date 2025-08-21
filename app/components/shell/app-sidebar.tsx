import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "react-router";
import { Logo } from "./logo";

const fohNavItems = [
  { route: "/", label: "Tabelle", icon: TableIcon },
  { route: "/spieler", label: "Spieler", icon: UsersIcon },
  { route: "/spiele", label: "Spiele", icon: DicesIcon },
];

export function AppSidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-semibold transition-colors text-gray-700 hover:bg-gray-100"
        >
          <Logo className="size-6 flex-shrink-0" />
          <span>runde.tips</span>
        </NavLink>
      </div>
      <hr className="border-gray-200" />
      <nav className="flex flex-col space-y-1 p-4">
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
      </nav>
    </aside>
  );
}
