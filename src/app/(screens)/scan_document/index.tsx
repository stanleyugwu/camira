import { GestureResponderEvent, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import tw from "~utils/tailwind";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import CameraPermissionView from "~components/CameraPermissionView";
import ThemeColors from "~constants/theme";
import {
  Ionicons as Icon,
  Feather as FeatherIcon,
  MaterialIcons,
} from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import FrameGuide, { FrameGuideProps } from "~components/FrameGuide";
import Button from "~components/button";
import CameraUnavailable from "~components/CameraUnavailable";
import { OCRFrame, scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";
import { useSharedValue } from "react-native-worklets-core";
import useHandleBars from "~hooks/useHandleBars";
import useCameraState from "~hooks/useCameraState";
import ScanResult, { ScanResultMethods } from "./components/ScanResult";
import useHandleAndroidBackButton from "~hooks/useHandleAndroidBackButton";

// Video configs
const ASPECT_RATIO = 4 / 3; // okay for most documents
const VIDEO_RES = { width: 1280, height: 720 }; // not to big, just ideal for OCR
const FPS = 1; // `scanOCR` frame processor takes 1s for each frame so this is ideal to avoid frame drops

/** Scan document screen */
export default function ScanDocument() {
  const resultSheetRef = useRef<ScanResultMethods>();
  const scanResult = useSharedValue<OCRFrame["result"]>(undefined);

  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const camera = useRef<Camera>();
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [cameraTorch, setCameraTorch] = useState<"off" | "on">("off");
  const cameraDevice = useCameraDevice("back", {
    physicalDevices: ["ultra-wide-angle-camera"],
  });
  const format = useCameraFormat(cameraDevice, [
    {
      fps: FPS,
      videoResolution: VIDEO_RES,
      videoAspectRatio: ASPECT_RATIO,
      videoStabilizationMode: "standard",
    },
  ]);

  const [screenFocused, cameraPaused, setCameraPaused] = useCameraState();

  const ocrProcessor = useFrameProcessor((frame) => {
    "worklet";
    const result = scanOCR(frame)?.result;
    scanResult.value = result;
  }, []);

  /** Focuses the camera to the x and y position of the frame guide */
  const setCameraFocus = useCallback<FrameGuideProps["onLayout"]>(
    (x, y) => {
      cameraInitialized &&
        cameraDevice.supportsFocus &&
        camera.current?.focus({ x, y });
    },
    [cameraInitialized]
  );

  useHandleBars(hasCameraPermission, cameraDevice.id);
  useHandleAndroidBackButton("/home/");

  // turns off camera torch when camera becomes inactive
  useEffect(() => {
    !screenFocused && setCameraTorch("off");
  }, [screenFocused]);

  if (!hasCameraPermission)
    return <CameraPermissionView onRequest={requestPermission} />;
  if (!cameraDevice) return <CameraUnavailable />;

  /** Focuses the camera to the x,y coordinate touched by the user */
  const handleTouchFocus = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.pageX;
    const y = evt.nativeEvent.pageY;
    setCameraFocus(x, y);
  };

  const snapDocument = () => {
    setCameraTorch("off");
    setCameraPaused(true);
    resultSheetRef.current?.show(scanResult.value);
  };

  const handleCloseSheet = () => {
    // we'll not use the current scan result again once the
    // sheet is closed, so free some memory
    scanResult.value = undefined;
    setCameraPaused(false);
  };

  return (
    <View style={[{ flex: 1 }]} onTouchStart={handleTouchFocus}>
      {/* DONTTOUCH: Removing this conditional mounting will freeze camera 
      on other screens, regardless of the value of `isActive` prop 
      */}
      {screenFocused && (
        <Camera
          ref={camera}
          audio={false}
          pixelFormat="yuv"
          orientation="portrait"
          onInitialized={() => setCameraInitialized(true)}
          lowLightBoost={cameraDevice.supportsLowLightBoost}
          fps={format.maxFps || FPS}
          enableBufferCompression
          frameProcessor={ocrProcessor}
          zoom={cameraDevice.neutralZoom}
          photo={false}
          video={false}
          torch={cameraTorch}
          device={cameraDevice}
          isActive={!cameraPaused}
          style={StyleSheet.absoluteFill}
        />
      )}
      {/* Camera Overlay */}
      <View style={tw`p-6 bg-transparent flex-1 justify-center`}>
        <View style={tw`flex-1 justify-end pb-14`}>
          <Button
            style={tw`self-center`}
            enableSquishAnimation={false}
            onPress={snapDocument}
            type="square"
            fill={false}
            icon={
              <MaterialIcons
                name="camera"
                size={scale(32)}
                color={ThemeColors.accent}
              />
            }
          />
          <View style={tw`flex-row justify-between items-center mt-8 px-12`}>
            {cameraDevice.hasTorch ? (
              <Icon
                color={ThemeColors.secondary}
                name={
                  cameraTorch === "off"
                    ? "ios-flash-outline"
                    : "ios-flash-off-outline"
                }
                size={scale(23)}
                onPress={() => {
                  setCameraTorch(cameraTorch === "off" ? "on" : "off");
                }}
              />
            ) : (
              <View /> // NOOP, just to move nex icon to the right
            )}
            <FeatherIcon
              color={ThemeColors.secondary}
              name="home"
              size={scale(23)}
              onPress={() => {
                router.push("/home/");
              }}
            />
          </View>
        </View>
      </View>
      <FrameGuide height={"92%"} animating={false} onLayout={setCameraFocus} />
      <ScanResult ref={resultSheetRef} onClose={handleCloseSheet} />
    </View>
  );
}
