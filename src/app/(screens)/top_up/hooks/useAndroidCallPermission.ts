import { useEffect } from "react";
import Constants from "expo-constants";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";

type UseAndroidCallPermission = (
  /** Determines whether camera permisssion has been granted.
   * In top-up screen, permission to access camera has to be granted first before call permission is even needed
   */
  cameraPermissionGranted: boolean
) => void;

/**
 * Handles requesting and verifying call permissions on android
 */
const useAndroidCallPermission: UseAndroidCallPermission = (
  cameraPermissionGranted
) => {
  // handles call permission for android
  useEffect(() => {
    if (cameraPermissionGranted && Platform.OS === "android") {
      const appName = Constants.expoConfig.name;
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE, {
        title: `Grant ${appName} Call Permission`,
        message: `You need to grant ${appName} CALL permission for this feature to work`,
        buttonPositive: "GRANT PERMISSION",
        buttonNegative: "DENY",
      })
        .then((value) => {
          if (value === "never_ask_again") {
            Alert.alert(
              `Grant ${appName} Call Permission`,
              `You need to grant ${appName} call permission for this feature to work`,
              [
                { style: "destructive", text: "IGNORE", isPreferred: false },
                {
                  text: "GRANT PERMISSION",
                  style: "default",
                  isPreferred: true,
                  onPress(_) {
                    Linking.openSettings();
                  },
                },
              ],
              { cancelable: false }
            );
          }
        })
        .catch(console.warn);
    }
  }, [cameraPermissionGranted]);
};

export default useAndroidCallPermission;
