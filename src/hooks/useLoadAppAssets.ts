import { Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

// pre-fetches and caches images for future use
function cacheImages(images: (string | number)[]) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

// caches fonts
function cacheFonts(fonts: Array<Parameters<(typeof Font)["loadAsync"]>[0]>) {
  return fonts.map((font) => Font.loadAsync(font));
}

/**
 * Pre-loads and caches core app assets and resources before app startup
 */
const useLoadAppAssets = () => {
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const fontAssets = cacheFonts([
          FontAwesome.font,
          MaterialIcons.font,
          {
            Muli: require("~assets/fonts/Muli.ttf"),
          },
        ]);

        // cache onboarding images
        const imageAssets = cacheImages([
          require('~screens/(onboarding)/images/top-up.png'),
          require('~screens/(onboarding)/images/document.png')
        ]);

        await Promise.all([...fontAssets, ...imageAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAssetsReady(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return {
    ready: assetsReady,
  };
};

export default useLoadAppAssets;
