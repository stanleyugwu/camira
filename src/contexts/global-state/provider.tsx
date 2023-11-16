import { useEffect, useReducer, useRef } from "react";
import reducer from "./reducer";
import initialState from "./initialState";
import { GlobalStateContext } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import STORAGE_KEYS from "~constants/storage_keys";
import { GlobalState } from "./index.d";

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Handles rehydrating global state
   */
  useEffect(() => {
    const getStoredState = async () => {
      let _state: GlobalState = initialState;
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.APPSTATE);
        if (value) _state = JSON.parse(value);
      } catch (error) {
        console.error("GLOBAL STATE HYDRATION FAILED", error);
      } finally {
        dispatch({ type: "HYDRATE", payload: _state });
      }
    };

    getStoredState();
  }, []);

  /**
   * Handles Persisting global state whenever a dispatch is made
   */
  useEffect(() => {
    // We don't run this effect until after the first render which is when
    // hydration effect above should run. This effect will still be ran after
    // hydration, but we'll just save one uneccessary render
    if (!state._isHydrated) return;

    const persistState = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.APPSTATE,
          JSON.stringify(state)
        );
      } catch (error) {
        console.error("GLOBAL STATE PERSISTENCE FAILED", error);
      }
    };
    persistState();
  }, [state]);

  return (
    <GlobalStateContext.Provider
      value={{ dispatch, state }}
      children={children}
      key={"GlobalStateContextProvider"}
    />
  );
};

export default GlobalStateProvider;
