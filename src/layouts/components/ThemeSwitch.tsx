import { ElementType } from 'react';
import { Menu } from '@headlessui/react';

import {
  DesktopComputerIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/outline';

import { useDarkMode } from '@/core/hooks/use-dark-mode';
import { classNames } from '@/core/helpers/class-names';

const themeNavigation: {
  theme: string;
  icon: ElementType;
}[] = [
  { theme: 'Light', icon: SunIcon },
  { theme: 'Dark', icon: MoonIcon },
  { theme: 'System', icon: DesktopComputerIcon },
];

export default function ThemeSwitch() {
  const { theme, setTheme, darkMode } = useDarkMode();

  return (
    <Menu as="div" className="flex relative">
      <Menu.Button className="text-gray-400 hover:text-gray-500 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-white">
        {darkMode ? (
          <MoonIcon className="h-6 w-6 m-1" />
        ) : (
          <SunIcon className="h-6 w-6 m-1 text-orange-500" />
        )}
      </Menu.Button>

      <Menu.Items className="origin-top-right absolute right-0 top-10 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-50 ring-opacity-5 focus:outline-none">
        {themeNavigation.map((item) => (
          <Menu.Item key={item.theme}>
            {({ active }) => {
              const targetTheme = item.theme.toLowerCase();
              const current = theme === targetTheme;
              const Icon = item.icon;
              return (
                <button
                  onClick={() => setTheme(targetTheme)}
                  className={classNames(
                    active
                      ? 'text-gray-900 bg-gray-200 dark:text-gray-50 dark:bg-gray-700'
                      : current
                      ? 'text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-900'
                      : 'text-gray-500 dark:text-gray-200',
                    'flex items-center text-sm font-medium w-full px-4 py-2'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="ml-2">{item.theme}</span>
                </button>
              );
            }}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
