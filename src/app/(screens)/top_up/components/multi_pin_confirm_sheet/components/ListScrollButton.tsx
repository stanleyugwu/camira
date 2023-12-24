//import libraries
import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

import SquishyButton from "~components/SquishyButton";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";
import { scale } from "react-native-size-matters";

export type ListScroller = (direction: "up" | "down") => void;

interface ListScrollButtonProps {
  /** Scroller function to scroll the list */
  scroll: ListScroller;
  /** Determines whether this component is hidden */
  hidden: boolean;
}

/** Scroll buttons for pins list */
const ListScrollButton = ({
  scroll,
  hidden = false,
}: ListScrollButtonProps) => {
  if (hidden) return null;
  return (
    <View style={tw`ml-2`}>
      <SquishyButton onPress={() => scroll("up")}>
        <Icon
          name="ios-chevron-up"
          size={scale(26)}
          color={ThemeColors.accent}
        />
      </SquishyButton>
      <View
        style={tw.style("bg-primary w-full my-1", {
          height: 2,
        })}
      />
      <SquishyButton onPress={() => scroll("down")}>
        <Icon
          name="ios-chevron-down"
          size={scale(26)}
          color={ThemeColors.accent}
        />
      </SquishyButton>
    </View>
  );
};

export default ListScrollButton;
