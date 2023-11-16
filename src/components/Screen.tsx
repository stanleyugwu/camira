import { ScrollViewProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tw from "~utils/tailwind";

export type ScreenProps = ScrollViewProps;

/**
 * Wraps children with necessary styles and provisions to suit a screen
 */
const Screen = (props: ScreenProps) => {
  return (
    <ScrollView
      contentContainerStyle={{ height: "100%" }}
      style={tw`p-6 flex-1 bg-primary`}
    >
      {props.children}
    </ScrollView>
  );
};

export default Screen;
