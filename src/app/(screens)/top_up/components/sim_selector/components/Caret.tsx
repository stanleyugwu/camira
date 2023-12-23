import { MotiView } from "moti";
import Icon from "@expo/vector-icons/Ionicons";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";

// shows a forward caret when there's multiple sims
const Caret = () => (
  <MotiView
    id="sim-icon"
    from={{ translateX: -20, opacity: 0 }}
    animate={{ translateX: 0, opacity: 1 }}
    exit={{ translateX: -20, opacity: 0 }}
  >
    <Icon
      name="ios-caret-forward-outline"
      size={scale(10)}
      color={ThemeColors.primary}
    />
  </MotiView>
);

export default Caret;
