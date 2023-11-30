import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { CameraDevice } from "react-native-vision-camera";
import ThemeColors from "~constants/theme";

type UseHandleBars = (
  /**
   * Determines whether camera permission has been granted.
   * This hook won't work until the permission is granted.
   */
  cameraPermissionGranted: boolean,

  /**
   * This is the unique `ID` of the camera device being used, typically
   * the value of `camerDevice.id`. This will neeed to be passed to ensure camera is available/mounted.
   *
   */
  cameraDeviceId: CameraDevice["id"]
) => void;

/**
 * Takes care of hiding the `navigator` back button, android `navigation bar`
 * and `status bar` when camera is opened in full-screen and its permission granted,
 * and showing it when the screen is exited
 */
const useHandleBars: UseHandleBars = (
  cameraPermissionGranted,
  cameraDeviceId
) => {
  const navigator = useNavigation();

  useEffect(() => {
    if (cameraPermissionGranted && cameraDeviceId) {
      navigator.setOptions({ headerShown: false });
      StatusBar.setHidden(true, "slide");
      try {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("inset-swipe");
      } catch (error) {
        console.log("Couldn't set navigation bar color");
      }
    }

    return () => {
      StatusBar.setHidden(false, "slide");
      StatusBar.setBackgroundColor(ThemeColors.primary, true);
      try {
        NavigationBar.setVisibilityAsync("visible");
      } catch (error) {}
    };
  }, [cameraPermissionGranted, cameraDeviceId]);
};

export default useHandleBars;
