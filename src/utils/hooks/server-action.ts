import { useCallback, useActionState } from "react";

export function useServerAction<TInput, TOutput>(
  serverFn: (input: { data: TInput }) => Promise<TOutput>,
) {
  const executeServerFn = useCallback(
    async (_prevState: TOutput | null, input: TInput) => await serverFn({ data: input }),
    [serverFn],
  );

  return useActionState(executeServerFn, null);
}
