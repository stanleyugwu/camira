import { Href, router } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

/**
 * Routes to the specified screen name when the back button is pressed
 * on android
 */
const useHandleAndroidBackButton = <T>(screen: Href<T>) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push(screen);
        return true;
      }
    );

    return subscription.remove;
  }, []);
};

export default useHandleAndroidBackButton;
