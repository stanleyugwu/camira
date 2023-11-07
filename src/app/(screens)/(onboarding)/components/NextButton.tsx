//import libraries
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Svg, { Circle, CircleProps } from "react-native-svg";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";
import Icon from "@expo/vector-icons/MaterialIcons";
import { scale } from "react-native-size-matters";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface NextButtonProps {
  // list progress percentage
  percentage: number;
  onPress: () => void;
}

// Round button which controls scrolling list
const NextButton = ({ percentage, onPress }: NextButtonProps) => {
  const progressAnimation = useSharedValue(0);

  // circle calculations
  const size = 85,
    strokeWidth = 2.5,
    center = size / 2,
    radius = size / 2 - strokeWidth / 2,
    circumference = 2 * Math.PI * (radius);

  const animatedCircleProps = useAnimatedProps<
    Animated.AnimateProps<CircleProps>
  >(() => ({
    strokeDashoffset:
      circumference - (circumference * progressAnimation.value) / 100,
  }));

  const animatedSvgProps = useAnimatedProps(() => ({
    width: percentage === 100 ? withSpring(size * 2) : withSpring(size),
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor:
      percentage < 100 ? ThemeColors.secondary : ThemeColors.accent,
    transform: [{ scale: withSpring(percentage < 100 ? 1 : 0.9) }],
  }));

  // auto runs animation on circle stroke whenever percentage prop changes
  // which means whenever list is scrolled
  useEffect(() => {
    progressAnimation.value = withSpring(percentage);
  }, [percentage]);

  return (
    <Animated.View
      style={[
        tw`box-shadow rounded-full items-center justify-center m-2`,
        animatedButtonStyle,
      ]}
    >
      <Pressable onPress={onPress}>
        <AnimatedSvg
          width={size}
          height={size}
          animatedProps={animatedSvgProps}
          fill={"transparent"}
        >
          <AnimatedCircle
            rotation={"-90"}
            stroke={ThemeColors.accent}
            strokeLinecap="round"
            x={center}
            y={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
            strokeDashoffset={circumference - (circumference * 25) / 100}
          />
        </AnimatedSvg>
        <Icon
          name="arrow-forward-ios"
          size={scale(23)}
          color={percentage < 100 ? ThemeColors.gray : ThemeColors.secondary}
          style={tw`self-center absolute top-7`}
        />
      </Pressable>
    </Animated.View>
  );
};

export default NextButton;
