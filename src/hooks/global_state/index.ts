import { useContext } from "react";
import { GlobalStateContext } from "~contexts/global-state";

/**
 * Convenience custom hook that returns both
 * global state and dispatch function from the
 * global state context, in a tuple.
 *
 * Use this when you want to both read and update global state
 */
const useStore = () => {
  const { dispatch, state } = useContext(GlobalStateContext);
  return [state, dispatch] as [typeof state, typeof dispatch];
};

export default useStore;
