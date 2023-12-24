import { GestureResponderEvent, Platform, View } from "react-native";
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
import Icon from "@expo/vector-icons/Feather";
import { scale } from "react-native-size-matters";
import FrameGuide, { FrameGuideProps } from "~components/FrameGuide";
import Button from "~components/button";
import CameraUnavailable from "~components/CameraUnavailable";
import PositonGuide from "./components/PositionGuide";
import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";
import RECHARGE_PIN_REGEX from "~constants/pin_regex";
import useGlobalState from "~hooks/global_state/useGlobalState";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { Worklets } from "react-native-worklets-core";
import SinglePinConfirmSheet from "./components/SinglePinConfirmSheet";
import MultiPinConfirmSheet from "./components/multi_pin_confirm_sheet";
import useAndroidCallPermission from "./hooks/useAndroidCallPermission";
import useHandleBars from "~hooks/useHandleBars";
import useCameraState from "~hooks/useCameraState";
import useHandleAndroidBackButton from "~hooks/useHandleAndroidBackButton";
import SimSelector from "./components/sim_selector";
import { andCall, iosCall } from "rn-direct-phone-call";

/** Scan top up screen */
export default function TopUp() {
  const {
    settings: { rechargePrefixCode, askForCodeConfirmation },
  } = useGlobalState();

  const confirmationSheetRef = useRef<BottomSheetMethods>();
  const [detectedPins, setDetectedPins] = useState<string[]>([]);
  const [dialingCode, setDialingCode] = useState(false);
  const [topUpSim, setTopUpSim] = useState(0); // sim to dial with, 0 = sim 1, 1 = sim 2

  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const camera = useRef<Camera>();
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [cameraTorch, setCameraTorch] = useState<"off" | "on">("off");
  const cameraDevice = useCameraDevice("back");
  const format = useCameraFormat(cameraDevice, [
    { fps: 1, videoResolution: { width: 480, height: 640 } },
  ]);
  const cameraHasTorch = cameraDevice?.hasTorch;
  const [screenFocused, cameraPaused, setCameraPaused] = useCameraState();
  useHandleBars(hasCameraPermission, cameraDevice.id);
  useAndroidCallPermission(hasCameraPermission);
  useHandleAndroidBackButton("/home/");

  // turns off camera torch when camera becomes inactive
  useEffect(() => {
    !screenFocused && setCameraTorch("off");
  }, [screenFocused]);

  /** Processes the OCR-extracted text to extract possible recharge pins*/
  const processText = Worklets.createRunInJsFn((text: string) => {
    // save us some computing power if text is not up to 5 characters
    if (!text || text.trim()?.length < 6) return;

    const detectedPins = text.match(RECHARGE_PIN_REGEX);
    if (detectedPins?.length) {
      if (askForCodeConfirmation) {
        setDetectedPins(detectedPins);
        setCameraPaused(true);
        confirmationSheetRef.current?.open();
      } else {
        // if confirm sheet is disabled, we dial the first match
        // which will be the longest detected pin
        const firstMatch = detectedPins[0];
        setCameraPaused(true);
        handleConfirmPin(firstMatch, true);
        setCameraPaused(false);
      }
    }
  });

  const ocrProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const result = scanOCR(frame)?.result;
      processText(result?.text);
    },
    [processText]
  );

  /** Focuses the camera to the x and y position of the frame guide */
  const setCameraFocus = useCallback<FrameGuideProps["onLayout"]>(
    (x, y) => {
      cameraInitialized &&
        cameraDevice.supportsFocus &&
        camera.current?.focus({ x, y });
    },
    [cameraInitialized]
  );

  if (!hasCameraPermission)
    return <CameraPermissionView onRequest={requestPermission} />;
  if (!cameraDevice) return <CameraUnavailable />;

  /** Focuses the camera to the x,y coordinate touched by the user */
  const handleTouchFocus = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.pageX;
    const y = evt.nativeEvent.pageY;
    setCameraFocus(x, y);
  };

  /** Handles dialing code after pin has been confirmed */
  const handleConfirmPin = (
    /** confirmed pin */
    pin: string,
    /** Determines whether pin is last pin
     * from the list so to close the sheet */
    isLastPin: boolean
  ) => {
    setDialingCode(true);
    pin = pin?.replace(/\D/gi, ""); // remove all non-digit
    const code = `${rechargePrefixCode}${pin}#`;
    Platform.OS === "android" ? andCall(code, topUpSim) : iosCall(code);

    if (isLastPin) confirmationSheetRef.current?.close();
    setDialingCode(false);
  };

  /** Handles rescanning pin */
  const handleScanAgain = () => {
    setCameraPaused(false);
    confirmationSheetRef.current?.close();
  };

  /** Called when confirm sheet is closed */
  const handleConfirmSheetClose = () => {
    setCameraPaused(false);
  };

  // confirmationSheetRef.current?.open();

  return (
    <View
      style={{ height: "100%", width: "100%" }}
      onTouchStart={handleTouchFocus}
    >
      {/* DONTTOUCH: Removing this conditional mounting will freeze camera 
      on other screens, regardless of the value of `isActive` prop 
      */}
      {screenFocused && cameraDevice && (
        <Camera
          audio={false}
          ref={camera}
          pixelFormat="yuv"
          orientation="portrait"
          onInitialized={() => setCameraInitialized(true)}
          lowLightBoost={cameraDevice.supportsLowLightBoost}
          fps={format.maxFps || 1}
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
      <View style={tw.style(`p-6 flex-1`)}>
        <PositonGuide />
        <View style={tw`flex-1 justify-end`}>
          <Button
            style={tw.style(`self-center`, !cameraHasTorch && "hidden")}
            onPress={() =>
              setCameraTorch((cameraTorch) =>
                cameraTorch === "off" && cameraHasTorch ? "on" : "off"
              )
            }
            type="square"
            fill={false}
            icon={cameraTorch === "off" ? "ios-flash" : "ios-flash-off"}
          />
          <View
            style={tw`flex-row justify-between items-center mt-8 px-8 mb-6`}
          >
            <SimSelector onSelect={(simNumber) => setTopUpSim(simNumber)} />
            <Icon
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

      <FrameGuide
        align="top"
        height={"15%"}
        animating={!cameraPaused}
        onLayout={setCameraFocus}
      />

      {/* Pin confirmation bottom sheet */}
      {detectedPins?.length > 1 ? (
        <MultiPinConfirmSheet
          ref={confirmationSheetRef}
          detectedPins={detectedPins}
          onConfirm={handleConfirmPin}
          confirmBtnLoading={dialingCode}
          onScanAgain={handleScanAgain}
          onClose={handleConfirmSheetClose}
        />
      ) : (
        <SinglePinConfirmSheet
          ref={confirmationSheetRef}
          detectedPin={detectedPins[0]}
          onConfirm={(pin) => handleConfirmPin(pin, true)}
          confirmBtnLoading={dialingCode}
          onScanAgain={handleScanAgain}
          onClose={handleConfirmSheetClose}
        />
      )}
    </View>
  );
}
