import { BaseModel } from '@/api/model/base';
import { classNames } from '@/core/helpers/class-names';
import { Combobox } from '@headlessui/react';
import {
  CheckIcon,
  ExclamationCircleIcon,
  SelectorIcon,
} from '@heroicons/react/outline';
import { useState } from 'react';

type ComboboxFieldProps<T> = {
  className?: string;
  name: string;
  label: string;
  items: T[];
  displayField: Extract<keyof T, string>;
  filter: (query: string, item: T) => boolean;
  value: string | undefined;
  onChange: (itemId: string) => void;
  onBlur: () => void;
  hasError?: boolean;
  errorMsg?: string;
};

function ComboboxField<T extends BaseModel>({
  className,
  name,
  label,
  items,
  displayField,
  filter,
  onBlur,
  value,
  onChange,
  hasError,
  errorMsg,
}: ComboboxFieldProps<T>) {
  const [query, setQuery] = useState('');

  const filteredItems =
    query === '' ? items : items.filter((item) => filter(query, item));

  return (
    <div className={className}>
      <Combobox as="div" value={value} onChange={onChange} className="relative">
        <Combobox.Label
          className={classNames(
            'block text-sm font-medium text-gray-700 dark:text-gray-200',
            hasError ? 'text-red-500 dark:text-red-500' : ''
          )}
        >
          {label}
        </Combobox.Label>
        <div className="relative mt-2 flex rounded-md shadow-sm">
          <div className="relative z-10 grow">
            <Combobox.Input
              name={name}
              className={classNames(
                'block w-full rounded-none rounded-l-md shadow-sm disabled:bg-gray-100 dark:bg-gray-800 dark:disabled:bg-gray-700 sm:text-sm',
                hasError
                  ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 dark:border-2 dark:border-red-600 dark:text-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600'
              )}
              autoComplete="off"
              onBlur={onBlur}
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(id: string) => {
                const item = items.find((it) => it.id === id)!;
                return String(item[displayField]);
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-1">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
            {hasError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                <ExclamationCircleIcon
                  data-testid="errorIcon"
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 focus-within:z-10 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Neu
          </button>
        </div>
        {filteredItems.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item.id}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => {
                  return (
                    <>
                      <span
                        className={classNames(
                          'block truncate',
                          selected ? 'font-semibold' : ''
                        )}
                      >
                        {item[displayField]}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 left-0 flex items-center pl-1.5',
                            active ? 'text-white' : 'text-indigo-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  );
                }}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox>
      {errorMsg && (
        <p data-testid="errorMsg" className="mt-2 text-sm text-red-500">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default ComboboxField;
