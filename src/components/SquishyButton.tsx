//import libraries
import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SquishyButtonProps = Animated.AnimateProps<
  PressableProps & React.RefAttributes<View>
> & {
  /**
   * Function to be called when button is pressed and after the squish animation
   */
  onPress: () => void;
  key?: string;
};

/**
 * Simple animated button with squishy press animation
 */
const SquishyButton = ({
  onPress,
  style,
  ...otherProps
}: SquishyButtonProps) => {
  const animatedValue = useSharedValue(1);
  const animatedPressableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedValue.value }],
  }));

  /**
   * creates a squish animation when button is
   * pressed and invokes a callback when done
   */
  const squish = (callback?: () => void) => {
    animatedValue.value = withSequence(
      withSpring(1.1),
      withSpring(1, undefined, () => {
        if (callback) runOnJS(callback)();
      })
    );
  };

  return (
    <AnimatedPressable
      key={"AnimatedSquishyPressable"}
      {...otherProps}
      onTouchStart={() => squish()}
      style={[animatedPressableStyle, style]}
      onPress={() => squish(onPress)}
    />
  );
};

export default SquishyButton;
