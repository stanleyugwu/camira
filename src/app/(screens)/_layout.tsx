import { Animated } from "react-native";
import ThemeColors from "~constants/theme";
import { CustomStack } from "~navigator";
import CustomHeader from "~navigator/CustomHeader";
import {
  StackCardStyleInterpolator,
  TransitionSpec,
} from "@react-navigation/stack/lib/typescript/src/types";
import React from "react";
import { StatusBar } from "expo-status-bar";
import useLoadAppAssets from "~utils/useLoadAppAssets";
import { ThemeProvider } from "@react-navigation/native";
import GlobalStateProvider from "~contexts/global-state/provider";
import CustomToastRoot from "~components/toast";

const spec: TransitionSpec = {
  animation: "timing",
  config: {
    duration: 1000,
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
            screen.height / 2, // Fully unfocused
          ]),
        },
      ],
      opacity: multplyProgress([0, 1, 0]),
    },
    // WARNING: Don't set `backgroundColor` in cardContainerStyle.
  };
};

/**
 * Theme for stack navigator
 */
const Theme = {
  colors: {
    background: ThemeColors.primary,
    border: ThemeColors.lightGray,
    card: ThemeColors.secondary,
    primary: ThemeColors.primary,
    notification: "red",
    text: ThemeColors.black,
  },
  dark: false,
};

export default function Layout() {
  const assets = useLoadAppAssets();
  if (!assets.ready) return null; // keep showing the splash screen

  return (
    <ThemeProvider value={Theme}>
      <GlobalStateProvider>
        <StatusBar
          networkActivityIndicatorVisible
          hideTransitionAnimation="slide"
          animated
          backgroundColor={ThemeColors.primary}
          style="inverted"
        />
        <CustomStack
          screenOptions={{
            gestureEnabled: true,
            headerShadowVisible: false,
            headerMode: "float",
            header: CustomHeader,
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
          <CustomStack.Screen
            name="settings/index"
            options={{ headerMode: "screen" }}
          />
          <CustomStack.Screen
            name="home/index"
            options={{ headerShown: false }}
          />
          <CustomStack.Screen name="top-up/index" />
        </CustomStack>
      </GlobalStateProvider>
      <CustomToastRoot/>
    </ThemeProvider>
  );
}
