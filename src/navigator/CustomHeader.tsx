import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { View, Animated } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";
import tw from "~utils/tailwind";
import Text from "~components/Text";

/**
 * Custom generic Header component for navigator
 */
const CustomHeader: (props: StackHeaderProps) => React.ReactNode = ({
  options: { headerTitle },
  navigation: { canGoBack, goBack },
  progress: { current, next },
  layout: { width },
}) => {
  const progress = Animated.add(
    current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  const interpolate = (outputRange: number[] | string[]) => {
    return progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange,
      extrapolate: "clamp",
    });
  };

  const animatedBackStyle = {
    transform: [
      {
        translateX: interpolate([-(width * 3), 0, 0]),
      },
      {
        translateY: interpolate([0, 0, -width]),
      },
    ],
  };
  const animatedTitleStyle = {
    transform: [
      {
        translateX: interpolate([-width, 0, 0]),
      },
      {
        translateY: interpolate([0, 0, -(width / 3)]),
      },
    ],
  };

  const _canGoBack = canGoBack();

  return (
    <View>
      {_canGoBack && (
        <Animated.View style={[tw`p-6 bg-pink`, animatedBackStyle]}>
          <Icon
            name="arrow-back-ios"
            color={ThemeColors.black}
            onPress={goBack}
            size={scale(28)}
          />
        </Animated.View>
      )}
      {headerTitle && (
        <Animated.View
          style={[
            tw.style(`pr-2 bg-blue-500`, _canGoBack ? "pl-6" : "p-6"),
            animatedTitleStyle,
          ]}
        >
          <Text type="heading" style={{ fontSize: 32 }}>
            {headerTitle as string}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default CustomHeader;
