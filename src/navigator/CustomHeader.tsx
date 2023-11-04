import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { View, Animated } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import ThemeColors from "~constants/theme";

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

  return (
    <View style={{ padding: 20 }}>
      {canGoBack() && (
        <Animated.View style={[animatedBackStyle]}>
          <Icon
            name="arrow-back-ios"
            color={ThemeColors.black}
            onPress={goBack}
            size={28}
          />
        </Animated.View>
      )}
      <Animated.Text style={[animatedTitleStyle]}>
        {headerTitle as string}
      </Animated.Text>
    </View>
  );
};

export default CustomHeader;
