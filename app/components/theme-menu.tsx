import type { Key } from 'react-aria-components';
import type { Theme } from '~/utils/theme';

import {
  CheckIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from 'lucide-react';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Button } from '~/components/ui/button';
import { Popover } from '~/components/ui/popover';
import { useTheme } from '~/utils/theme';
import {includes} from "~/utils/misc";

const colorSchemes: {
  name: Theme['colorScheme'];
  label: string;
  icon: React.ElementType;
}[] = [
  { name: 'light', label: 'Hell', icon: SunIcon },
  { name: 'dark', label: 'Dunkel', icon: MoonIcon },
  { name: 'system', label: 'System', icon: LaptopIcon },
];

const menuItemStyles = tv({
  base: [
    'flex rounded-lg p-2 text-sm outline-none transition-colors',
    'data-[focused]:bg-app-3 data-[selected]:text-accent-11',
  ],
});

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  const selectedColorScheme = new Set([theme.colorScheme]);

  function colorSchemeChange(key: Key) {
    if (
      includes(
        colorSchemes.map((cs) => cs.name),
        key,
      )
    ) {
      !selectedColorScheme.has(key) && setTheme({ ...theme, colorScheme: key });
    }
  }

  return (
    <MenuTrigger>
      <Button variant="toolbar">
        <SunMoonIcon className="size-6" />
      </Button>
      <Popover>
        <Menu
          className="flex w-[180px] flex-col gap-y-1 p-1.5"
          selectionMode="single"
          selectedKeys={selectedColorScheme}
          onAction={colorSchemeChange}
        >
          {colorSchemes.map((cs) => {
            const Icon = cs.icon;
            return (
              <MenuItem key={cs.name} id={cs.name} className={menuItemStyles()}>
                {({ isSelected }) => (
                  <div className="flex grow justify-between">
                    <div className="flex gap-2" aria-hidden="true">
                      <Icon className="size-5" aria-hidden />
                      <span className="select-none">{cs.label}</span>
                    </div>
                    {isSelected && <CheckIcon className="size-5" aria-hidden />}
                  </div>
                )}
              </MenuItem>
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
