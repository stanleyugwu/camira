import React from "react";
import { type TextProps as _TextProps, Text as _Text } from "react-native";
import ThemeColors from "~constants/theme";

type FontSizePair = [fontSize: number, lineHeight: number];
type FontTypes =
  | "heading"
  | "subHeading"
  | "paragraph"
  | "label"
  | "label (small)"
  | "paragraph (bold)";

/**
 * App UI-defined font types in the form: `type:[font-size, line-height]`
 */
const AppFontTypes: Record<FontTypes, FontSizePair> = {
  heading: [28, 34],
  subHeading: [24, 28],
  paragraph: [18, 22],
  label: [14, 16],
  "label (small)": [12, 16],
  "paragraph (bold)": [18, 22],
};

/**
 * Custom Text component props
 */
export interface TextProps extends _TextProps {
  /** Type of the text */
  type?: FontTypes;
  /** Color of the text */
  color?: keyof typeof ThemeColors;
}

/**
 * Custom `Text` component that respects app theming
 */
const Text = ({
  type = "paragraph",
  color = "black",
  children,
  style,
  ...otherProps
}: TextProps) => {
  return (
    <_Text
      // DONTTOUCH: Removing this breaks font sizing on some android devices
      allowFontScaling={false}
      
      style={[
        {
          fontFamily: "Muli",
          fontSize: AppFontTypes[type][0],
          lineHeight: AppFontTypes[type][1],
          fontWeight: type == "paragraph" ? "normal" : "bold",
          color: ThemeColors[color],
        },
        style,
      ]}
      children={children}
      {...otherProps}
    />
  );
};

export default Text;
