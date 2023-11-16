import { createContext } from "react";
import initialState from "./initialState";
import type { ContextValue } from "./index.d";

export const GlobalStateContext = createContext<ContextValue>({
  // initial context values
  dispatch: (_) => {
    // NOOP: we'll set the real values in the provider.

    // Incase this is called which shouldn't happen unless a
    // consumer tries to read context value without a provider wrapper,
    // let's log a warning
    console.warn(
      "FALLBACK GLOBAL_STATE CONTEXT DISPATCH FUNCTION CALLED, CHECK FOR MISSING CONTEXT PROVIDER"
    );
  },
  state: initialState,
});
