import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "camira",
  name: "Camira",
  scheme: ["camira"],
  plugins: ["expo-router"],
  orientation: "portrait",
  backgroundColor: "#F0F0FF" /* ThemeColors.primary */,
  androidNavigationBar: {
    backgroundColor: "#F0F0FF" /* ThemeColors.primary */,
    barStyle: "dark-content",
  },
  androidStatusBar: {
    backgroundColor: "#F0F0FF" /* ThemeColors.primary */,
    barStyle: "dark-content",
  },
  userInterfaceStyle: "light",
  primaryColor: "#500DBC" /* ThemeColors.accent */,
  developmentClient: {
    silentLaunch: true,
  },
  version: "1.0.0",
  splash: {
    backgroundColor: "#500DBC" /* ThemeColors.accent */,
    resizeMode: "contain",
  },
  experiments: { tsconfigPaths: true, typedRoutes: true },
  android: {
    package: "com.devvie.camira",
  },
});
