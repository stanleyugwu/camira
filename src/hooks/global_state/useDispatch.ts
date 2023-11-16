import { useContext } from "react";
import { GlobalStateContext } from "~contexts/global-state";

/**
 * Convenience custom hook that returns global
 * state dispatch function from global state context
 * 
 * Use this when you want to just update global state
 */
const useDispatch = () => {
  const { dispatch } = useContext(GlobalStateContext);
  return dispatch;
};

export default useDispatch;
