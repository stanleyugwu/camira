import { GestureResponderEvent, StatusBar, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import tw from "~utils/tailwind";
import { StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import CameraPermissionView from "./components/CameraPermissionView";
import ThemeColors from "~constants/theme";
import Icon from "@expo/vector-icons/Feather";
import { scale } from "react-native-size-matters";
import FrameGuide, { FrameGuideProps } from "./components/FrameGuide";
import Button from "~components/button";
import CameraUnavailable from "./components/CameraUnavailable";
import { useIsFocused } from "@react-navigation/native";
import useAppState from "~utils/useAppState";
import * as NavigationBar from "expo-navigation-bar";
import PositonGuide from "./components/PositionGuide";
import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";

export default function TopUp() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigator = useNavigation();

  const camera = useRef<Camera>();

  const [cameraTorch, setCameraTorch] = useState<"off" | "on">("off");
  const cameraDevice = useCameraDevice("back");
  const cameraHasTorch = cameraDevice.hasTorch;

  // monitor app state
  const screenIsFocused = useIsFocused();
  const appIsFocused = useAppState();
  const isActive = screenIsFocused && appIsFocused;

  // takes care of hiding navigator back button, navigation bar
  // and status bas as soon as camera permission is granted
  useEffect(() => {
    if (hasPermission && cameraDevice.id) {
      navigator.setOptions({ headerShown: false });
      StatusBar.setHidden(true, "slide");
      try {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("inset-touch");
      } catch (error) {
        console.log("Couldn't set navigation bar color");
      }
    }

    return () => {
      StatusBar.setHidden(false, "slide");
      StatusBar.setBackgroundColor(ThemeColors.primary, true);
      try {
        NavigationBar.setVisibilityAsync("hidden");
      } catch (error) {}
    };
  }, [hasPermission, cameraDevice.id]);

  /** Focuses the camera to the x and y position of the frame guide */
  const setCameraFocus = useCallback<FrameGuideProps["onLayout"]>((x, y) => {
    camera.current?.focus({ x, y });
  }, []);

  const ocrProcessor = useFrameProcessor((frame) => {
    "worklet";
    const ocrFrame = scanOCR(frame).result;
    console.log(ocrFrame.text);
  }, []);

  if (!hasPermission)
    return <CameraPermissionView onRequest={requestPermission} />;
  if (!cameraDevice) return <CameraUnavailable />;

  const handleTouchFocus = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.pageX;
    const y = evt.nativeEvent.pageY;
    setCameraFocus(x, y);
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={handleTouchFocus}>
      <Camera
        photo={false}
        enableZoomGesture
        frameProcessor={ocrProcessor}
        torch={cameraTorch}
        ref={camera}
        device={cameraDevice}
        isActive={isActive}
        style={StyleSheet.absoluteFill}
      />
      {/* Camera Overlay */}
      <View style={tw`p-6 bg-transparent flex-1`}>
        <Icon
          color={ThemeColors.secondary}
          name="home"
          size={scale(23)}
          style={tw`self-end`}
          onPress={() => {
            router.push("/home/");
          }}
        />
        <FrameGuide onLayout={setCameraFocus} />
        <PositonGuide />
        <View style={tw`flex-1 justify-end pb-6`}>
          <Button
            style={tw`self-center`}
            onPress={() =>
              setCameraTorch((cameraTorch) =>
                cameraTorch === "off" && cameraHasTorch ? "on" : "off"
              )
            }
            type="square"
            fill={false}
            icon={cameraTorch === "off" ? "ios-flash" : "ios-flash-off"}
          />
        </View>
      </View>
    </View>
  );
}
