//import libraries
import React, { useState } from "react";
import { Pressable, View, ViewProps } from "react-native";
import Text from "~components/Text";
import Icon from "@expo/vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";
import { AnimatePresence, MotiView } from "moti";

// TODO: Find better ts approach to infer items values type for rich intellisense

interface SelectibleItemsProps extends ViewProps {
  /**
   * Array of strings representing each item
   */
  items: readonly string[];

  /**
   * Determines the active item.
   * Active item will be checked
   */
  activeItem?: SelectibleItemsProps["items"][number];

  /**
   * Function to be called when an item is selected
   */
  onSelect: (selected: string) => void;
}

/**
 * Traverses passed list and creates a set of
 * selectible items
 */
const SelectibleItems = ({
  activeItem,
  items,
  onSelect,
  style,
  ...otherProps
}: SelectibleItemsProps) => {
  const [active, setActive] = useState(activeItem || items[0]);

  return (
    <View style={[tw`w-full rounded-md p-2 bg-primary`, style]} {...otherProps}>
      {items.map((item, index, list) => (
        <Pressable
          key={item}
          android_ripple={{ borderless: true, color: ThemeColors.secondary }}
          onPress={() => {
            setActive(item);
          }}
          style={tw`flex-row border-${
            index == list.length - 1 ? "0" : "b"
          } border-[#dde] justify-between items-center bg-primary`}
        >
          <Text type="paragraph (bold)" color="gray" style={tw`py-4 pl-4`}>
            {item}
          </Text>
          <AnimatePresence
            exitBeforeEnter
            // DONTTOUCH: Don't move `onSelect` callback call from this prop to `onDidAnimate`
            onExitComplete={() => {
              onSelect(active);
            }}
          >
            {active === item && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1.05 }}
                transition={{ type: "spring", duration: 200 }}
                exit={{ scale: 0 }}
                exitTransition={{ type: "timing", duration: 200 }}
              >
                <Icon
                  key={"checkmark icon"}
                  name="ios-checkmark-sharp"
                  size={scale(22)}
                  style={tw`pr-2`}
                  color={ThemeColors.lightGray}
                />
              </MotiView>
            )}
          </AnimatePresence>
        </Pressable>
      ))}
    </View>
  );
};

export default SelectibleItems;
