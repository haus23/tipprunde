import { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, FolderAddIcon } from '@heroicons/react/outline';

import { classNames } from '@/core/helpers/class-names';

import { Championship } from '@/api/model/championship';
import { Round } from '@/api/model/round';
import { useCurrentChampionship } from '@/views/backyard/hooks/use-current-championship';

import BackyardContent from '@/layouts/components/BackyardContent';

const items: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: ElementType;
  visible: (championship: Championship | null, rounds: Round[]) => boolean;
}[] = [
  {
    title: 'Neues Turnier',
    description:
      'Starte eine komplett neue Liga-Halbserie oder eine EM bzw. WM',
    icon: FolderAddIcon,
    background: 'bg-pink-500',
    route: './neues-turnier',
    visible: () => true,
  },
  {
    title: 'Neue Runde',
    description: 'Lege eine neue (Monats-) Runde mit Spielansetzungen an',
    icon: CalendarIcon,
    background: 'bg-yellow-500',
    route: './neue-runde',
    visible: (championship: Championship | null) => championship !== null,
  },
];

export default function Dashboard() {
  const { championship } = useCurrentChampionship();

  return (
    <BackyardContent title="Hinterhof">
      {championship !== null && (
        <h2 className="pb-4 text-lg font-semibold">
          Turnier: {championship.title}
        </h2>
      )}

      <ul role="list" className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items
          .filter((item) => item.visible(championship, []))
          .map((item, itemIdx) => (
            <li
              key={itemIdx}
              className={
                championship == null
                  ? 'col-span-2 mx-auto w-full max-w-md sm:mt-16'
                  : ''
              }
            >
              <div
                className={classNames(
                  'relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-white dark:hover:bg-gray-800'
                )}
              >
                <div
                  className={classNames(
                    item.background,
                    'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                  )}
                >
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    <Link to={item.route} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.title}
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </BackyardContent>
  );
}
