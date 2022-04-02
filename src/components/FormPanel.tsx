import { ReactNode } from 'react';
import { classNames } from '@/core/helpers/class-names';

type FormPanelProps = {
  children: ReactNode;
  className?: string;
};

export default function FormPanel({ children, className }: FormPanelProps) {
  return (
    <div
      className={classNames(
        'bg-white dark:bg-gray-800 py-8 px-4 border border-gray-300 dark:border-gray-600 shadow-md sm:rounded-lg sm:px-10 mx-auto w-full',
        className ?? ''
      )}
    >
      {children}
    </div>
  );
}
