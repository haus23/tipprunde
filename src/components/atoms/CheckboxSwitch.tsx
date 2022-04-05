import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react';
import { classNames } from '@/core/helpers/class-names';

type CheckboxSwitchProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
};

function CheckboxSwitch(
  { label, checked, onChange }: CheckboxSwitchProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <label className="flex relative items-center cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={classNames(
          checked
            ? 'bg-indigo-600 border-indigo-600 justify-end'
            : 'bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
          'w-10 h-4 rounded-full border flex items-center transition'
        )}
      >
        <span className="bg-white ring-1 ring-gray-300 border-gray-300 h-4 w-4 absolute rounded-full" />
      </div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
}

export default forwardRef(CheckboxSwitch);
