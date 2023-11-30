import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import STORAGE_KEYS from "~constants/storage_keys";
import type { GlobalState } from "~contexts/global-state/index.d";

type HookReturnType = GlobalState | undefined | null;
type UseLoadStoredState = () => HookReturnType;

/**
 * Loads the persisted global app state from
 * AsyncStorage asyncronously and return the parsed value.
 *
 * @returns {HookReturnType}
 * `undefined`: still retrieving data\
 * `null`: data retrieved but empty\
 * `GlobalState`: data retrieved and parsed
 */
const useLoadStoredState: UseLoadStoredState = () => {
  const [state, setState] = useState<HookReturnType>(undefined);
  useEffect(() => {
    const getData = async () => {
      try {
        const state = JSON.parse(
          await AsyncStorage.getItem(STORAGE_KEYS.APPSTATE)
        );
        setState(state);
      } catch (error) {
        console.error(error);
        setState(null);
      }
    };

    getData();
  }, []);
  return state as HookReturnType;
};

export default useLoadStoredState;
