import { twMerge } from 'tailwind-merge';

export const focusVisibleStyles = twMerge(
  'outline-hidden data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-info-11',
);
