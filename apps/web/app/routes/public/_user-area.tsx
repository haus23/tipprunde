import { Button } from "@tipprunde/ui";
import {
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { Link, useSubmit } from "react-router";

import { useColorSchemeToggle } from "#/components/color-scheme-toggle.tsx";
import type { User } from "#/lib/context.ts";

const menuItemClass =
  "text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none";

export function UserArea({ user }: { user: User | null }) {
  const submit = useSubmit();
  const toggleScheme = useColorSchemeToggle();

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-muted hover:bg-nav-active hover:text-app focus-visible:ring-accent flex h-8 items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition ease-out outline-none focus-visible:ring-2 max-sm:px-2"
      >
        <span className="max-sm:sr-only">Anmelden</span>
        <LogInIcon className="size-4" />
      </Link>
    );
  }

  return (
    <MenuTrigger>
      <Button intent="ghost" size="sm" className="h-8 max-sm:px-2">
        {/* Below sm the name is screen-reader only; a bare chevron would
            leave nothing to recognise the menu by. */}
        <UserIcon aria-hidden className="size-4 sm:hidden" />
        <span className="max-sm:sr-only">{user.name}</span>
        {/* Dropped below 360px, where the header runs out of room. */}
        <ChevronDownIcon className="size-4 max-[360px]:hidden" />
      </Button>
      <Popover
        placement="bottom end"
        offset={4}
        className="border-subtle bg-surface-raised shadow-popover w-44 origin-top-right rounded-md border p-1 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Menu className="outline-none">
          <MenuItem href="/konto" className={menuItemClass}>
            <UserIcon aria-hidden className="text-muted size-4" />
            Mein Konto
          </MenuItem>
          {user.role !== "user" && (
            <MenuItem href="/manager" className={menuItemClass}>
              <SettingsIcon aria-hidden className="text-muted size-4" />
              Manager
            </MenuItem>
          )}
          {/* The scheme control lives here once logged in: a rarely used
              setting, and the header needs the room for the chat. Icon and
              label are CSS-driven like the header button's — while "system"
              is stored the server cannot know which one applies. */}
          <MenuItem onAction={toggleScheme} textValue="Design wechseln" className={menuItemClass}>
            <MoonIcon aria-hidden className="text-muted size-4 dark:hidden" />
            <SunIcon aria-hidden className="text-muted hidden size-4 dark:block" />
            <span className="dark:hidden">Dunkles Design</span>
            <span className="hidden dark:inline">Helles Design</span>
          </MenuItem>
          <MenuItem
            onAction={() => void submit(null, { method: "post", action: "/logout" })}
            className={menuItemClass}
          >
            <LogOutIcon aria-hidden className="text-muted size-4" />
            Abmelden
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
