import type { Key } from 'react-aria-components';
import type { Theme } from '~/utils/prefs';

import {
  CheckIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from 'lucide-react';
import { Menu, MenuItem, MenuTrigger } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

import { Button } from '~/components/ui/button';
import { Popover } from '~/components/ui/popover';
import { includes } from '~/utils/misc';
import { useTheme } from '~/utils/prefs';

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
      <Button
        variant="toolbar"
        className="overflow-clip"
        iconOnly
        style={{ '--theme-icon-width': '20px' } as React.CSSProperties}
      >
        <div className="relative size-[var(--theme-icon-width)]">
          <SunIcon
            className={twMerge(
              '-rotate-45 absolute inset-0 size-[var(--theme-icon-width)] origin-[50%_100px] transition-transform duration-300',
              theme.colorScheme === 'light' && 'rotate-0',
              theme.colorScheme === 'system' && '-rotate-90',
            )}
          />
          <MoonIcon
            className={twMerge(
              'absolute inset-0 size-[var(--theme-icon-width)] origin-[50%_100px] rotate-0 transition-transform duration-300',
              theme.colorScheme === 'light' && 'rotate-45',
              theme.colorScheme === 'system' && '-rotate-45',
            )}
          />
          <SunMoonIcon
            className={twMerge(
              'absolute inset-0 size-[var(--theme-icon-width)] origin-[50%_100px] rotate-45 transition-transform duration-300',
              theme.colorScheme === 'light' && 'rotate-90',
              theme.colorScheme === 'system' && 'rotate-0',
            )}
          />
        </div>
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
