import { createContext, useContext } from "react";
import { Provider, TextFieldContext } from "react-aria-components";

const LockContext = createContext(false);

export function LockProvider({
  isLocked,
  children,
}: {
  isLocked: boolean;
  children: React.ReactNode;
}) {
  return (
    <LockContext.Provider value={isLocked}>
      <Provider values={[[TextFieldContext, { isDisabled: isLocked }]]}>{children}</Provider>
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
