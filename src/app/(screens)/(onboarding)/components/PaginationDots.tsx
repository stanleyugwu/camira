//import libraries
import React from "react";
import { View } from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";

interface PaginationDotsProps {
  // length of the scenes array
  scenesLength: number;

  // scroll X position of the list items, to be used for interplation
  scrollX: SharedValue<number>;

  // width of each scene
  sceneWidth: number;
}

const DOT_SIZE = 10;

// Dots for showing active scene in list
const PaginationDots = ({
  scenesLength = 1,
  scrollX,
  sceneWidth,
}: PaginationDotsProps) => {
  return (
    <View style={tw`flex-row`}>
      {new Array(scenesLength).fill(1).map((_, idx) => {
        const animatedStyles = useAnimatedStyle(() => {
          const scrollXInputRange = [
            (idx - 1) * sceneWidth,
            idx * sceneWidth,
            (idx + 1) * sceneWidth,
          ];
          const animatedWidth = interpolate(
            scrollX.value,
            scrollXInputRange,
            [DOT_SIZE, DOT_SIZE * 2, DOT_SIZE],
            Extrapolate.CLAMP
          );
          return {
            width: animatedWidth,
            height: DOT_SIZE,
            backgroundColor: interpolateColor(
              scrollX.value,
              scrollXInputRange,
              ["#bbb", ThemeColors.accent, "#bbb"]
            ),
          };
        });

        return (
          <Animated.View
            style={[tw`m-2 rounded-full`, animatedStyles]}
            key={idx}
          />
        );
      })}
    </View>
  );
};

export default PaginationDots;
