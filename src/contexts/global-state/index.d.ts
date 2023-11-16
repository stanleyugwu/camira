import { Dispatch } from "react";
import { StartUpScreens } from "~constants/startup_screen";

/**
 * Type for app global state
 */
export type GlobalState = {
  settings: {
    startUpScreen: StartUpScreens;
    askForCodeConfirmation: boolean;
    rechargePrefixCode: string;
  };

  /** Indicate whether the state has being rehydrated (synced with persisted state) */
  _isHydrated: boolean;
};

export type ActionTypes =
  | "SET_STARTUP_SCREEN"
  | "SET_ASK_CODE_CONFIRMATION"
  | "SET_RECHARGE_PREFIX_CODE"
  // HYDRATE is used to set the entire state typically from a persisted state
  | "HYDRATE";

/** Creates an action object type */
type CreateActionType<Type extends ActionTypes, Payload = any> = {
  type: Type;
  payload: Payload;
};

/** Creates union of actions for different global state fields */
export type Action =
  | CreateActionType<"SET_STARTUP_SCREEN", StartUpScreens>
  | CreateActionType<"SET_RECHARGE_PREFIX_CODE", string>
  | CreateActionType<"SET_ASK_CODE_CONFIRMATION", boolean>
  | CreateActionType<"HYDRATE", GlobalState>;

/** Type for Global State `Context` Value */
export type ContextValue = {
  state: GlobalState;
  dispatch: Dispatch<Action>;
};
