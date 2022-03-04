import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { classNames } from '@/core/helpers/class-names';

type TextFieldProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  labelHidden?: boolean;
  errorMsg?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { label = 'Label', labelHidden = false, errorMsg, className, ...props },
    ref
  ) => {
    const hasError = typeof errorMsg !== 'undefined';

    return (
      <div className={className}>
        <label className="block">
          <span
            style={{ display: labelHidden ? 'none' : undefined }}
            className={classNames(
              'block text-sm font-medium text-gray-700 dark:text-gray-200',
              hasError ? 'text-red-500 dark:text-red-500' : ''
            )}
          >
            {label}
          </span>
          <div className="relative mt-2">
            <input
              type="text"
              ref={ref}
              {...props}
              className={classNames(
                'block w-full rounded-md shadow-sm disabled:bg-gray-100 dark:bg-gray-800 dark:disabled:bg-gray-700 sm:text-sm',
                hasError
                  ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 dark:border-2 dark:border-red-600 dark:text-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600'
              )}
            />
            {hasError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  data-testid="errorIcon"
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </label>
        {errorMsg && (
          <p data-testid="errorMsg" className="mt-2 text-sm text-red-300">
            {errorMsg}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';

export default TextField;
