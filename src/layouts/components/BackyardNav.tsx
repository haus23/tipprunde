import { ElementType } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  LightBulbIcon,
  UserIcon,
} from '@heroicons/react/outline';

import { classNames } from '@/core/helpers/class-names';

import { useProfile } from '@/api/hooks/use-profile';
import { useCurrentChampionship } from '@/views/backyard/hooks/use-current-championship';
import { useRounds } from '@/api/hooks/use-rounds';

import { Championship } from '@/api/model/championship';
import { Round } from '@/api/model/round';

import Logo from '@/layouts/components/Logo';

type SidebarProps = {
  onNavAction?: () => void;
};

const navLinks: {
  to: string;
  icon: ElementType;
  label: string;
  visible: (championship: Championship | null, rounds: Round[]) => boolean;
}[] = [
  {
    to: '.',
    icon: HomeIcon,
    label: 'Dashboard',
    visible: () => true,
  },
  {
    to: './turnier',
    icon: FolderIcon,
    label: 'Turnier',
    visible: (championship) => championship !== null,
  },
  {
    to: './spiele',
    icon: CalendarIcon,
    label: 'Spiele',
    visible: (championship, rounds) =>
      championship !== null && rounds?.length > 0,
  },
  {
    to: './experiment',
    icon: LightBulbIcon,
    label: 'Experiment',
    visible: () => true,
  },
];

export default function BackyardNav({ onNavAction }: SidebarProps) {
  const { profile } = useProfile();
  const { championship } = useCurrentChampionship();
  const { rounds } = useRounds(championship?.id);

  return (
    <div className="flex grow flex-col border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex grow flex-col overflow-y-auto">
        <div className="flex h-14 shrink items-center px-4 md:h-16">
          <Link onClick={onNavAction} className="flex items-center" to="/">
            <Logo className="h-8" />
            <h1 className="ml-2 text-2xl font-semibold">runde.tips</h1>
          </Link>
        </div>
        <nav className="mt-2 grow space-y-1 px-2">
          {navLinks
            .filter((link) => link.visible(championship, rounds))
            .map((link, ix) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={ix}
                  to={link.to}
                  onClick={onNavAction}
                  end
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={classNames(
                          isActive
                            ? 'text-gray-500 dark:text-gray-300'
                            : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                      />
                      {link.label}
                    </>
                  )}
                </NavLink>
              );
            })}
        </nav>
      </div>
      <div className="shrink border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="block w-full">
          <div className="flex items-center">
            <div>
              {profile.photoURL ? (
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={profile.photoURL}
                  alt="User Avatar"
                />
              ) : (
                <UserIcon className="inline-block h-9 w-9 rounded-full bg-gray-200 p-1 text-gray-400 dark:bg-gray-900 dark:text-gray-300" />
              )}
            </div>
            <div className="ml-3 grow">
              <p className="w-44 overflow-clip overflow-ellipsis text-sm font-medium text-gray-700 dark:text-gray-200">
                {profile.name ? profile.name : profile.email}
              </p>
              <div className="flex gap-x-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Link
                  onClick={onNavAction}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                  to="./profil"
                >
                  Profil
                </Link>
                {' / '}
                <Link
                  onClick={onNavAction}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                  to="/logout"
                >
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
