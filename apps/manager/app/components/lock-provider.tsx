import { createContext, useContext } from "react";
import { Provider, TextFieldContext } from "react-aria-components";
import { useFetchers } from "react-router";

const LockContext = createContext(false);

export function LockProvider({
  isLocked,
  children,
}: {
  isLocked: boolean;
  children: React.ReactNode;
}) {
  const isAnyPending = useFetchers().some((f) => f.state !== "idle");
  const isDisabled = isLocked || isAnyPending;
  return (
    <LockContext.Provider value={isDisabled}>
      <Provider values={[[TextFieldContext, { isDisabled }]]}>{children}</Provider>
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
