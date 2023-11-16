import type { Action, GlobalState } from "./index.d";

/**
 * GLobal state root reducer
 */
const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_RECHARGE_PREFIX_CODE":
      return {
        ...state,
        settings: {
          ...state.settings,
          rechargePrefixCode: action.payload,
        },
      };
    case "SET_STARTUP_SCREEN":
      return {
        ...state,
        settings: {
          ...state.settings,
          startUpScreen: action.payload,
        },
      };
    case "SET_ASK_CODE_CONFIRMATION":
      return {
        ...state,
        settings: {
          ...state.settings,
          askForCodeConfirmation: action.payload,
        },
      };

    // HYDRATION here means syncing persisted state with app state
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        _isHydrated: true,
      };

    default:
      return state;
  }
};

export default reducer;
