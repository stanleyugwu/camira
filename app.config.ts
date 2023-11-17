import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): Partial<ExpoConfig> => ({
  ...config,
  plugins: [
    "expo-router",
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "150c8639-91cb-40ae-a4df-f72143d28eed",
    },
  },
});
