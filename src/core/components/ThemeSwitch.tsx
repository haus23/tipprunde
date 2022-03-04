import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  DesktopComputerIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/outline';
import { useDarkMode } from '../hooks/use-dark-mode';

import NavButton from '@/ui/atoms/NavButton';
import NavMenuItem from '@/ui/atoms/NavMenuItem';

function ThemeSwitch() {
  const { theme, setTheme, darkMode } = useDarkMode();

  return (
    <Menu as="div" className="flex relative z-20">
      <Menu.Button as={NavButton}>
        {darkMode ? (
          <MoonIcon className="h-6 w-6 m-1" />
        ) : (
          <SunIcon className="h-6 w-6 m-1 text-orange-500" />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 top-10 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-50 ring-opacity-5 focus:outline-none">
          <NavMenuItem
            current={theme === 'light'}
            onClick={() => setTheme('light')}
          >
            <SunIcon className="h-6 w-6" />
            <span className="ml-2">Light</span>
          </NavMenuItem>
          <NavMenuItem
            current={theme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            <MoonIcon className="h-6 w-6" />
            <span className="ml-2">Dark</span>
          </NavMenuItem>
          <NavMenuItem
            current={theme === 'system'}
            onClick={() => setTheme('system')}
          >
            <DesktopComputerIcon className="h-6 w-6" />
            <span className="ml-2">System</span>
          </NavMenuItem>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default ThemeSwitch;
