import { View, ViewProps } from "react-native";
import tw from "~utils/tailwind";

export type ScreenProps = ViewProps;

/**
 * Wraps children with necessary styles and provisions to suit a screen
 */
const Screen = (props: ScreenProps) => {
  return <View style={[tw`p-6 flex-1 bg-primary`, props.style]}>{props.children}</View>;
};

export default Screen;
