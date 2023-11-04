import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "camira",
  name: "Camira",
  scheme: ["camira"],
  plugins: ["expo-router"],
  experiments: { tsconfigPaths: true, typedRoutes: true, turboModules: true },
});
