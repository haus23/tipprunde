import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { MenuIcon } from '@heroicons/react/outline';

import { useAuth } from '@/api/hooks/use-auth';
import { classNames } from '@/core/helpers/class-names';

import BackyardNav from '@/layouts/components/BackyardNav';
import ThemeSwitch from '@/layouts/components/ThemeSwitch';

export default function Backyard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <BackyardNav />
      </div>
      <div
        className={classNames(
          'absolute z-20 top-0 right-4 flex h-14 items-center transition-opacity md:h-16',
          sidebarOpen ? 'opacity-0' : 'opacity-100'
        )}
      >
        <ThemeSwitch />
      </div>
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white py-1 pl-1 dark:bg-gray-800 sm:pl-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5  inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
