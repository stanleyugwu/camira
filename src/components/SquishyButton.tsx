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
  
  /**
   * Determines whether the __squish__ interaction animation is enabled.\
   * When `true`, the button will squish / scale up when pressed
   * @default true
   */
  enableSquishAnimation?: boolean;
  key?: string;
};

/**
 * Simple animated button with squishy press animation
 */
const SquishyButton = ({
  onPress,
  disabled,
  enableSquishAnimation = true,
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
      withSpring(1.07),
      withSpring(1, undefined, () => {
        if (callback) runOnJS(callback)();
      })
    );
  };

  return (
    <AnimatedPressable
      key={"AnimatedSquishyPressable"}
      {...otherProps}
      onTouchStart={() => !disabled && enableSquishAnimation && squish()}
      style={[animatedPressableStyle, style]}
      onPress={() => {
        if (!disabled) {
          enableSquishAnimation ? squish(onPress) : onPress();
        }
      }}
    />
  );
};

export default SquishyButton;
