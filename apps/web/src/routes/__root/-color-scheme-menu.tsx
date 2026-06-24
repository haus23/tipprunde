// Color-scheme control: an icon-button trigger opening a RAC Menu
// (Light / Dark / System). See docs/web-shell.md.
import { useRouter } from "@tanstack/react-router";
import { Button } from "@tipprunde/ui";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { setColorScheme } from "#/lib/color-scheme.ts";
import type { ColorScheme } from "#/lib/session.ts";

const options: {
  value: ColorScheme;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "light", label: "Hell", Icon: SunIcon },
  { value: "dark", label: "Dunkel", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
];

export function ColorSchemeMenu({ colorScheme }: { colorScheme: ColorScheme }) {
  const router = useRouter();

  async function choose(key: React.Key) {
    const value = key as ColorScheme;
    // Optimistic: flip the attribute now so there's no flash before revalidation
    document.documentElement.setAttribute("data-color-scheme", value);
    await setColorScheme({ data: value });
    await router.invalidate();
  }

  return (
    <MenuTrigger>
      <Button intent="ghost" size="icon" aria-label="Farbschema">
        <span className="relative size-4">
          <SunIcon className="absolute inset-0 size-full scale-75 opacity-0 transition-[transform,opacity] ease-out in-data-[color-scheme=light]:scale-100 in-data-[color-scheme=light]:opacity-100" />
          <MoonIcon className="absolute inset-0 size-full scale-75 opacity-0 transition-[transform,opacity] ease-out in-data-[color-scheme=dark]:scale-100 in-data-[color-scheme=dark]:opacity-100" />
          <MonitorIcon className="absolute inset-0 size-full scale-75 opacity-0 transition-[transform,opacity] ease-out in-data-[color-scheme=system]:scale-100 in-data-[color-scheme=system]:opacity-100" />
        </span>
      </Button>
      <Popover
        placement="bottom end"
        offset={4}
        className="border-subtle bg-surface-raised shadow-popover w-40 origin-top-right rounded-md border p-1 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Menu
          aria-label="Farbschema"
          selectionMode="single"
          selectedKeys={[colorScheme]}
          onAction={(key) => void choose(key)}
          className="outline-none"
        >
          {options.map(({ value, label, Icon }) => (
            <MenuItem
              key={value}
              id={value}
              textValue={label}
              className="text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            >
              {({ isSelected }) => (
                <>
                  <Icon className="text-muted size-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {isSelected && <CheckIcon className="text-accent size-3.5 shrink-0" />}
                </>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
