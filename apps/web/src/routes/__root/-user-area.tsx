import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@tipprunde/ui";
import { ChevronDownIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { logout } from "#/lib/auth.ts";
import type { SessionUser } from "#/lib/session.ts";

export function UserArea({ user, managerUrl }: { user: SessionUser | null; managerUrl: string }) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    await router.invalidate();
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-muted hover:bg-nav-active hover:text-app focus-visible:ring-accent flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition ease-out outline-none focus-visible:ring-2 max-sm:px-1.5"
      >
        <span className="max-sm:sr-only">Anmelden</span>
        <LogInIcon className="size-4" />
      </Link>
    );
  }

  if (user.role === "user") {
    return (
      <Button intent="ghost" size="sm" className="max-sm:px-1.5" onPress={handleLogout}>
        <span className="max-sm:sr-only">Abmelden</span>
        <LogOutIcon className="size-4" />
      </Button>
    );
  }

  return (
    <MenuTrigger>
      <Button intent="ghost" size="sm" className="max-sm:px-1.5">
        <span className="max-sm:sr-only">{user.name}</span>
        <ChevronDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom end"
        offset={4}
        className="border-subtle bg-surface-raised shadow-popover w-44 origin-top-right rounded-md border p-1 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Menu className="outline-none">
          <MenuItem
            href={managerUrl}
            className="text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
          >
            Manager
          </MenuItem>
          <MenuItem
            onAction={handleLogout}
            className="text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
          >
            Abmelden
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
