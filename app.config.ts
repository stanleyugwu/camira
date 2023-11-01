import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "camira",
  name: "Camira",
  plugins: ["expo-router"],
});