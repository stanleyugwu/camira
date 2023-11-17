import { scale } from "react-native-size-matters";
import _Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from "react-native-toast-message";
import tw from "~utils/tailwind";
import Icon from "@expo/vector-icons/Ionicons";

const baseToastProps = {
  style: tw.style("border-l-0 bg-secondary"),
  text1Style: tw.style(`text-gray font-muli mt-1.5`, {
    fontSize: scale(14),
    lineHeight: 16,
    fontWeight: "normal",
  }),
  text2Style: tw.style(`text-lightGray font-muli`, {
    fontSize: scale(12),
    lineHeight: 16,
    fontWeight: "normal",
  }),
};

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      {...baseToastProps}
      renderLeadingIcon={() => (
        <Icon
          name="ios-checkmark-circle-sharp"
          style={tw`self-center ml-4 -mr-4`}
          size={scale(30)}
          color={"#00aa00"}
        />
      )}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      {...baseToastProps}
      renderLeadingIcon={() => (
        <Icon
          style={tw`self-center ml-4 -mr-4`}
          name="ios-warning"
          size={scale(30)}
          color={"#dd0000"}
        />
      )}
    />
  ),

  info: (props) => (
    <InfoToast
      {...props}
      {...baseToastProps}
      renderLeadingIcon={() => (
        <Icon
          style={tw`self-center ml-4 -mr-4`}
          name="ios-information-circle-sharp"
          size={scale(30)}
          color={"#eebb00"}
        />
      )}
    />
  ),
};

/**
 * This is a pre-configured convenience wrapper component for showing toasts
 */
const CustomToastRoot = () => {
  return <_Toast visibilityTime={3000} config={toastConfig} />;
};

export default CustomToastRoot;
