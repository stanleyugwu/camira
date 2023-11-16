//import libraries
import React from "react";
import { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import Text from "~components/Text";
import ANIMATIONS from "~constants/animation";
import tw from "~utils/tailwind";

export interface CategoryTextProps extends Animated.AnimateProps<ViewProps> {
  /** Category name */
  category: string;
}

/**
 * Renders simple animated title for settings category
 */
const CategoryText = ({
  category,
  style,
  ...otherProps
}: CategoryTextProps) => {
  return (
    <Animated.View
      entering={ANIMATIONS.Entrance.fromDown
        .duration(ANIMATIONS.BASE_DURATION)
        .delay(400)
        .build()}
      style={[tw`mb-3 mt-10`, style]}
      {...otherProps}
    >
      <Text type="label" color="black">
        {category}
      </Text>
    </Animated.View>
  );
};

export default CategoryText;
