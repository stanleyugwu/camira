import { Animated, StatusBar } from "react-native";
import ThemeColors from "~constants/theme";
import { CustomStack } from "~navigator";
import CustomHeader from "~navigator/CustomHeader";
import {
  StackCardStyleInterpolator,
  TransitionSpec,
} from "@react-navigation/stack/lib/typescript/src/types";
import React, { useEffect, useLayoutEffect } from "react";
import useLoadAppAssets from "~utils/useLoadAppAssets";
import { ThemeProvider } from "@react-navigation/native";
import GlobalStateProvider from "~contexts/global-state/provider";
import CustomToastRoot from "~components/toast";
import {
  StartUpScreens,
  getStartupScreenKeyFromValue,
} from "~constants/startup_screen";
import { router } from "expo-router";
import useLoadStoredState from "~hooks/useLoadStoredState";

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

interface StackScreensProps {
  startupScreenName: StartUpScreens | null;
}

/**
 * This is merely a wrapper around stack navigator just to allow us to
 * handle auto-routing based on user-set startup screen
 */
const StackScreens = ({ startupScreenName }: StackScreensProps) => {
  // handles auto-routing to user-set startup screen
  useLayoutEffect(() => {
    if (startupScreenName !== null) {
      // change globally-stored `Home` to routable 'home/index'
      const startScreen = getStartupScreenKeyFromValue(startupScreenName);
      // @ts-expect-error
      typeof startScreen === "string" && router.push(`/${startScreen}/`);
    }
  }, []);

  return (
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
      <CustomStack.Screen name="home/index" options={{ headerShown: false }} />
      <CustomStack.Screen
        name="settings/index"
        options={{ headerMode: "screen" }}
      />
      <CustomStack.Screen
        name="top_up/index"
        options={{
          freezeOnBlur: false,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
      <CustomStack.Screen
        name="scan_document/index"
        options={{
          freezeOnBlur: false,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
    </CustomStack>
  );
};

/** App screens layout */
export default function Layout() {
  useEffect(() => {
    StatusBar.setBackgroundColor(ThemeColors.primary);
    StatusBar.setBarStyle("dark-content");
  }, []);

  const appStoredState = useLoadStoredState();
  const assets = useLoadAppAssets();

  // keep showing the splash screen until assets are loaded and app state is loaded
  if (!assets.ready && appStoredState === undefined) return null;

  return (
    <ThemeProvider value={Theme}>
      <GlobalStateProvider>
        <StackScreens
          startupScreenName={appStoredState?.settings?.startUpScreen}
        />
      </GlobalStateProvider>
      <CustomToastRoot />
    </ThemeProvider>
  );
}
