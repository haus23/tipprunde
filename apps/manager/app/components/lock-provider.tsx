import { createContext, useContext } from "react";
import { Provider, TextFieldContext } from "react-aria-components";
import { useFetchers, useNavigation } from "react-router";

type LockState = {
  /** Championship is completed → read-only; structural controls may be removed. */
  isChampionshipClosed: boolean;
  /** Current round is completed → edits frozen for this scope. */
  isRoundClosed: boolean;
  /** A fetch or navigation is in flight → disable only, never restructure. */
  isBusy: boolean;
  /** Convenience merge: disabled for any reason above. */
  isDisabled: boolean;
};

const LockContext = createContext<LockState>({
  isChampionshipClosed: false,
  isRoundClosed: false,
  isBusy: false,
  isDisabled: false,
});

export function LockProvider({
  isChampionshipClosed = false,
  isRoundClosed = false,
  children,
}: {
  isChampionshipClosed?: boolean;
  isRoundClosed?: boolean;
  children: React.ReactNode;
}) {
  // Both hooks must run unconditionally — do not collapse into a short-circuiting
  // `||`, or useNavigation() gets skipped whenever a fetcher is pending (hook
  // count changes → "rendered fewer hooks than expected").
  const hasPendingFetcher = useFetchers().some((f) => f.state !== "idle");
  const isNavigating = useNavigation().state !== "idle";
  const isBusy = hasPendingFetcher || isNavigating;
  const isDisabled = isChampionshipClosed || isRoundClosed || isBusy;

  return (
    <LockContext.Provider value={{ isChampionshipClosed, isRoundClosed, isBusy, isDisabled }}>
      {/* Text inputs auto-disable on any lock reason via the merged value. */}
      <Provider values={[[TextFieldContext, { isDisabled }]]}>{children}</Provider>
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
