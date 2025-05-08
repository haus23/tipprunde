import { twMerge } from 'tailwind-merge';

export const focusVisibleStyles = twMerge(
  'rounded-sm outline-hidden',
  'data-focus-visible:ring-1 data-focus-visible:ring-app-7 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-transparent',
);
