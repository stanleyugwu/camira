import { Platform, PlatformColor } from "react-native";

// App theme colors according to UI design
const ThemeColors = {
  primary: "#F0F0FF",
  secondary: "#FFFFFF",
  accent: "#500DBC",
  black: "#020202",
  gray: Platform.OS === "android" ? "#333333" : "#444556",
  lightGray: Platform.OS === "android" ? "#676767" : "#676788",
};

export default ThemeColors;
