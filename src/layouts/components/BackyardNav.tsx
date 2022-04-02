import { Link } from 'react-router-dom';
import Logo from '@/layouts/components/Logo';
import { useProfile } from '@/api/hooks/use-profile';
import { UserIcon } from '@heroicons/react/outline';

type SidebarProps = {
  onNavAction?: () => void;
};

export default function BackyardNav({ onNavAction }: SidebarProps) {
  const { profile } = useProfile();

  return (
    <div className="flex grow flex-col border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex grow flex-col overflow-y-auto">
        <div className="flex h-14 shrink items-center px-4 md:h-16">
          <Link onClick={onNavAction} className="flex items-center" to="/">
            <Logo className="h-8" />
            <h1 className="ml-2 text-2xl font-semibold">runde.tips</h1>
          </Link>
        </div>
        <nav className="mt-2 grow space-y-1 px-2"></nav>
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
