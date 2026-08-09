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
  /**
   * Disable state for inline keyboard-entry controls (text fields, grid
   * checkboxes). Excludes the pending fetcher so a save firing on blur doesn't
   * steal focus from the field/checkbox the user just tabbed into. Still locks
   * on closure and during navigation (data swaps underneath).
   */
  isEntryLocked: boolean;
};

const LockContext = createContext<LockState>({
  isChampionshipClosed: false,
  isRoundClosed: false,
  isBusy: false,
  isDisabled: false,
  isEntryLocked: false,
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

  // Inline entry controls deliberately do NOT lock on a pending fetcher: a save
  // fires on blur, and disabling every field mid-save would steal focus from the
  // field/checkbox the user just tabbed into, breaking sequential entry. They
  // still lock on closure and during navigation (which swaps the data underneath
  // — e.g. the player switch in tips, where edits would otherwise hit the wrong
  // player).
  const isEntryLocked = isChampionshipClosed || isRoundClosed || isNavigating;

  return (
    <LockContext.Provider
      value={{ isChampionshipClosed, isRoundClosed, isBusy, isDisabled, isEntryLocked }}
    >
      <Provider values={[[TextFieldContext, { isDisabled: isEntryLocked }]]}>{children}</Provider>
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
