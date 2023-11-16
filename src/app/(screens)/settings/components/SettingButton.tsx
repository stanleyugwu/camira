//import libraries
import React from "react";
import { View } from "react-native";
import SquishyButton, { SquishyButtonProps } from "~components/SquishyButton";
import Icon from "@expo/vector-icons/Ionicons";
import Text from "~components/Text";
import tw from "~utils/tailwind";
import { scale } from "react-native-size-matters";
import ThemeColors from "~constants/theme";
import ANIMATIONS from "~constants/animation";

interface SettingButtonProps extends SquishyButtonProps {
  /**
   * name of icon to display to the left of button
   */
  iconName: keyof typeof Icon.glyphMap;

  /**
   * label text of the setting
   */
  label: string;

  /**
   * small text label displayed to the right of the button
   * typically indicating current setting
   */
  rightLabel?: string;

  /**
   * Called when the button is pressed
   */
  onPress: () => void;

  /**
   * Entrance animation delay in milliseconds
   */
  animationDelay?: number;
}

/**
 * Renders a single pressable button for individual setting
 */
const SettingButton = ({
  iconName,
  label,
  onPress,
  rightLabel,
  animationDelay = 0,
  style,
  ...otherProps
}: SettingButtonProps) => {
  return (
    <SquishyButton
      entering={ANIMATIONS.Entrance.fromDown
        .duration(ANIMATIONS.BASE_DURATION)
        .delay(animationDelay)
        .build()}
      onPress={onPress}
      style={[
        styles.flexRow,
        tw`rounded-md bg-secondary justify-between box-shadow py-5 px-3`,
        style,
      ]}
      {...otherProps}
    >
      {/* Icon and Label */}
      <View style={styles.flexRow}>
        <Icon
          name={iconName}
          style={{ opacity: 0.8 }}
          color={ThemeColors.accent}
          size={scale(20)}
        />
        <Text type="label" color="gray" style={tw`ml-2`}>
          {label}
        </Text>
      </View>

      {/* Right Label and Arrow*/}
      <View style={styles.flexRow}>
        {rightLabel ? (
          <Text type="label (small)" color="lightGray">
            {rightLabel}
          </Text>
        ) : null}
        <Icon
          size={scale(20)}
          color={ThemeColors.lightGray}
          name="ios-chevron-forward-sharp"
        />
      </View>
    </SquishyButton>
  );
};

const styles = {
  flexRow: tw`flex-row items-center justify-center`,
};

export default SettingButton;
