import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

export const twMerge = extendTailwindMerge({});

export type { VariantProps } from 'tailwind-variants';
export const tv = createTV({});
