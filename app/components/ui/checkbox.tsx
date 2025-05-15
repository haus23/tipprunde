import type { CheckboxProps as _CheckboxProps } from 'react-aria-components';

import { Checkbox as _Checkbox } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const containerStyles = tv({
  base: 'group flex items-center gap-x-2',
});

const styles = tv({
  base: [
    'flex h-5 w-5 items-center justify-center rounded border-2 border-app-7 transition-all duration-150',
    'group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-info-7',
    'group-data-[pressed=true]:scale-90',
  ],
});

const svgStyles = tv({
  base: [
    'h-3 w-3 fill-none stroke-0 stroke-success-9 transition-all duration-150',
    'group-data-[selected=true]:stroke-3',
  ],
});

interface CheckboxProps extends _CheckboxProps {
  children: React.ReactNode;
  className?: string;
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <_Checkbox {...props} className={containerStyles()}>
      {({ isSelected }) => (
        <>
          <div className={styles()}>
            <svg viewBox="0 0 18 18" aria-hidden="true" className={svgStyles()}>
              <polyline points="1 9 7 14 15 4" />
            </svg>
          </div>
          <span className="font-semibold text-sm">{children}</span>
        </>
      )}
    </_Checkbox>
  );
}
