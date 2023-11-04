import { Animated, StatusBar } from "react-native";
import ThemeColors from "~constants/theme";
import { CustomStack } from "~navigator";
import CustomHeader from "~navigator/CustomHeader";
import {
  StackCardStyleInterpolator,
  TransitionSpec,
} from "@react-navigation/stack/lib/typescript/src/types";
import React from "react";

const spec: TransitionSpec = {
  animation: "timing",
  config: {
    duration: 1200,
    easing(value) {
      return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
    },
  },
};

const cardInterpolator: StackCardStyleInterpolator = ({
  current,
  next,
  inverted,
  layouts: { screen },
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  // multiplies progress node for multiple animations
  const multplyProgress = (outputRange: number[] | string[]) => {
    return Animated.multiply(
      progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange,
        extrapolate: "clamp",
      }),
      inverted
    );
  };

  return {
    cardStyle: {
      transform: [
        {
          translateY: multplyProgress([
            screen.height, // Focused, but offscreen in the beginning
            0, // Fully focused
            screen.height / 1.5, // Fully unfocused
          ]),
        },
      ],
      opacity: multplyProgress([0, 1, 0]),
    },
  };
};

export default function Layout() {
  StatusBar.setBackgroundColor(ThemeColors.primary);
  return (
    <CustomStack
      screenOptions={{
        gestureEnabled: true,
        headerShadowVisible: false,
        headerMode: "float",
        header: CustomHeader,
        cardStyle: { backgroundColor: ThemeColors.primary },
        cardStyleInterpolator: cardInterpolator,
        transitionSpec: {
          open: spec,
          close: spec,
        },
      }}
    >
      <CustomStack.Screen
        name="(onboarding)/index"
        options={{
          headerShown: false,
        }}
      />
      <CustomStack.Screen name="home/index" options={{ headerShown: false }} />
    </CustomStack>
  );
}
