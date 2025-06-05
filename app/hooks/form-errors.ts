import type { AnyFormApi } from '@tanstack/react-form';

import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

export function useFormErrors<TForm extends AnyFormApi>(form: TForm) {
  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
  return useMemo(() => {
    return Object.entries(fieldMeta).reduce(
      (acc, [key, value]) => {
        if (value.errors.length > 0) {
          acc[key] = value.errors;
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [fieldMeta]);
}
