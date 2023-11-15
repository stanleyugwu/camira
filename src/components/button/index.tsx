//import libraries
import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import tw from "~utils/tailwind";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import SquishyButton, { SquishyButtonProps } from "~components/SquishyButton";
import Text from "~components/Text";
import loader from "./assets/loader.json";
import loader_white from "./assets/loader-white.json";

type DefaultButtonProps = SquishyButtonProps & {
  /**
   * Determines whether button should have a fill/background color
   * which will be the primary color from app theme
   */
  fill?: boolean;

  /**
   * Determines whether button is disabled or not
   */
  disabled?: boolean;

  /**
   * Function to be called when button is pressed
   */
  onPress: () => void;

  /**
   * Determines whether the button should show a loading indicator
   */
  loading?: boolean;
};

type RectangleButtonProps = DefaultButtonProps & {
  /**
   * Text label to display in the button
   */
  label: string;

  /**
   * Determines the size of the button.
   * Can be "small" or "big"
   *
   * `'small'`: Renders a small rectangular button with label and optional icon\
   * `'big'`: Renders a normal-sized rectangular button with label and optional icon
   */
  type: "small" | "big";

  /**
   * Name of the icon to display to the right of the button
   */
  iconName?: keyof typeof Icon.glyphMap;
};

type SquareButtonProps = DefaultButtonProps & {
  /**
   * Square button can't have label, only icon
   */
  label?: never;

  /**
   * Renders a big square-sized button with icon
   */
  type: "square";

  /**
   * Name of the icon to display to the right of the button
   */
  iconName: keyof typeof Icon.glyphMap;
};

type ButtonProps = RectangleButtonProps | SquareButtonProps;

/**
 * app-theme flavored button component.
 * Should be used for displaying all buttons for the app.
 *
 * `Note:` It extends/compose from `SquishyButton` component
 */
const Button = ({
  iconName,
  label,
  fill = true,
  type = "big",
  onPress,
  disabled,
  loading = false,
  ...otherProps
}: ButtonProps) => {
  const sharedStyle = tw.style(
    "rounded-md items-center justify-center",
    disabled ? "bg-primary" : fill ? "bg-accent" : "bg-secondary"
  );

  return (
    <SquishyButton
      android_ripple={{
        color: fill ? ThemeColors.secondary : ThemeColors.accent,
        borderless: false,
        foreground: true,
        radius: 2,
      }}
      disabled={disabled || loading}
      onPress={onPress}
      {...otherProps}
    >
      {/* For Square */}
      {type === "square" ? (
        <View
          style={[
            sharedStyle,
            tw.style(
              `w-70 h-60`,
              disabled
                ? "border border-[#eee]"
                : !fill && "border border-accent"
            ),
          ]}
        >
          {loading ? (
            <LottieView
              loop
              autoPlay
              duration={2500}
              style={{
                width: 30,
                height: 30,
              }}
              source={fill ? loader_white : loader}
            />
          ) : (
            <Icon
              name={iconName || "link-outline"}
              size={scale(26)}
              style={{ opacity: disabled ? 0.5 : 1 }}
              color={
                ThemeColors[
                  disabled ? "lightGray" : fill ? "secondary" : "accent"
                ]
              }
            />
          )}
        </View>
      ) : (
        // For Big or Small
        <View
          style={[
            sharedStyle,
            tw.style(
              "flex-row px-4",
              type === "big" ? "max-w-80 py-3" : "max-w-70 py-2.7",
              disabled
                ? "border border-[#eee]"
                : !fill && "border border-accent"
            ),
          ]}
        >
          {/* Label */}
          <Text
            type={type === "big" ? "paragraph (bold)" : "label"}
            color={disabled ? "lightGray" : fill ? "secondary" : "accent"}
            style={tw.style(
              iconName ? "text-start mr-1" : `text-center`,
              disabled && "opacity-50"
            )}
          >
            {loading ? "Loading" : label}
          </Text>
          {loading ? (
            <LottieView
              autoPlay
              duration={2500}
              loop
              style={{
                width: 15,
                height: 15,
              }}
              source={fill ? loader_white : loader}
            />
          ) : (
            iconName && (
              <Icon
                name={iconName}
                size={scale(type === "big" ? 22 : 20)}
                color={
                  ThemeColors[
                    disabled ? "lightGray" : fill ? "secondary" : "accent"
                  ]
                }
                style={tw.style(`ml-1`, disabled && "opacity-50")}
              />
            )
          )}
        </View>
      )}
    </SquishyButton>
  );
};

export default Button;