import { Separator, type SeparatorProps } from 'react-aria-components';
import { type VariantProps, tv } from '#/utils/tv';

const styles = tv({
  base: 'bg-grey-6',
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface DividerProps extends SeparatorProps, VariantProps<typeof styles> {}

export function Divider({ className, orientation, ...props }: DividerProps) {
  return (
    <Separator
      orientation={orientation}
      className={styles({ orientation, className })}
      {...props}
    />
  );
}
