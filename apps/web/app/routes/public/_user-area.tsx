import { Button } from "@tipprunde/ui";
import { ChevronDownIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { Form, Link, useSubmit } from "react-router";

import type { User } from "#/lib/context.ts";

const menuItemClass =
  "text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none";

export function UserArea({ user }: { user: User | null }) {
  const submit = useSubmit();

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-muted hover:bg-nav-active hover:text-app focus-visible:ring-accent flex h-7 items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition ease-out outline-none focus-visible:ring-2 max-sm:px-1.5"
      >
        <span className="max-sm:sr-only">Anmelden</span>
        <LogInIcon className="size-4" />
      </Link>
    );
  }

  // Plain players have nothing to reach behind a menu — one button is enough.
  if (user.role === "user") {
    return (
      <Form method="post" action="/logout">
        <Button type="submit" intent="ghost" size="sm" className="h-7 max-sm:px-1.5">
          <span className="max-sm:sr-only">Abmelden</span>
          <LogOutIcon className="size-4" />
        </Button>
      </Form>
    );
  }

  return (
    <MenuTrigger>
      <Button intent="ghost" size="sm" className="h-7 max-sm:px-1.5">
        <span className="max-sm:sr-only">{user.name}</span>
        <ChevronDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom end"
        offset={4}
        className="border-subtle bg-surface-raised shadow-popover w-44 origin-top-right rounded-md border p-1 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Menu className="outline-none">
          <MenuItem href="/manager" className={menuItemClass}>
            Manager
          </MenuItem>
          <MenuItem
            onAction={() => void submit(null, { method: "post", action: "/logout" })}
            className={menuItemClass}
          >
            Abmelden
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
