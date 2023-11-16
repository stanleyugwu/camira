import { StartUpScreens } from "~constants/startup_screen";
import { GlobalState } from "./index.d";

/**
 * Global initial state
 */
const initialState: GlobalState = {
  settings: {
    startUpScreen: StartUpScreens.home,
    askForCodeConfirmation: true,
    rechargePrefixCode: "*311*",
  },
  _isHydrated: false,
};

export default initialState;
