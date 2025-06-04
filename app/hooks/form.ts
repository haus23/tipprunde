import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

const { fieldContext, formContext, useFormContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

export { useFieldContext, useFormContext, useAppForm };
