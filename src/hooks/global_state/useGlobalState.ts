import { useContext } from "react";
import { GlobalStateContext } from "~contexts/global-state";

/**
 * Convenience custom hook that returns global
 * state dispatch function from global state context
 *
 * Use this when you want to just read from global state
 */
const useGlobalState = () => {
  const { state } = useContext(GlobalStateContext);
  return state;
};

export default useGlobalState;
