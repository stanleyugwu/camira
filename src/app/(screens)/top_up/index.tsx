import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  View,
} from "react-native";
import {
  Camera,
  Templates,
  runAsync,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import tw from "~utils/tailwind";
import { StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import CameraPermissionView from "~components/CameraPermissionView";
import ThemeColors from "~constants/theme";
import Icon from "@expo/vector-icons/Feather";
import { scale } from "react-native-size-matters";
import FrameGuide, { FrameGuideProps } from "~components/FrameGuide";
import Button from "~components/button";
import CameraUnavailable from "~components/CameraUnavailable";
import { useIsFocused } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import PositonGuide from "./components/PositionGuide";
import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";
import RECHARGE_PIN_REGEX from "~constants/pin_regex";
import useAppIsFocused from "~utils/useAppIsFocused";
import useGlobalState from "~hooks/global_state/useGlobalState";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { Worklets } from "react-native-worklets-core";
import SinglePinConfirmSheet from "./components/SinglePinConfirmSheet";
import MultiPinConfirmSheet from "./components/multi_pin_confirm_sheet";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import Constants from "expo-constants";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

/** Scan top up screen */
export default function TopUp() {
  const navigator = useNavigation();
  const {
    settings: { rechargePrefixCode, askForCodeConfirmation },
  } = useGlobalState();

  const confirmationSheetRef = useRef<BottomSheetMethods>();
  const [detectedPins, setDetectedPins] = useState<string[]>([]);
  const [dialingCode, setDialingCode] = useState(false);

  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const camera = useRef<Camera>();
  const [cameraIsActive, setCameraIsActive] = useState(true);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [cameraTorch, setCameraTorch] = useState<"off" | "on">("off");
  const cameraDevice = useCameraDevice("back");
  const format = useCameraFormat(cameraDevice, [
    { fps: 3, videoResolution: { width: 480, height: 640 } },
  ]);
  const cameraHasTorch = cameraDevice?.hasTorch;

  // monitor app state
  const screenIsFocused = useIsFocused();
  const appIsFocused = useAppIsFocused();
  const isActive = screenIsFocused && appIsFocused && cameraIsActive;

  // takes care of hiding navigator back button, navigation bar
  // and status bas as soon as camera permission is granted
  useEffect(() => {
    if (hasCameraPermission && cameraDevice.id) {
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
  }, [hasCameraPermission, cameraDevice.id]);

  // turns off camera torch when camera becomes inactive
  useEffect(() => {
    !cameraIsActive && setCameraTorch("off");
  }, [cameraIsActive]);

  // handles call permission for android
  useEffect(() => {
    if (hasCameraPermission && Platform.OS === "android") {
      const appName = Constants.expoConfig.name;
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE, {
        title: `Grant ${appName} Call Permission`,
        message: `Call permission is needed to enable scan-top up feature. If you deny this permission, this feature won't work`,
        buttonPositive: "GRANT PERMISSION",
        buttonNegative: "DENY",
      })
        .then((value) => {
          console.log(value);
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
  }, [hasCameraPermission]);

  /** Processes the OCR-extracted text to extract possible recharge pins*/
  const processText = Worklets.createRunInJsFn((text: string) => {
    // save us some computing power if text is not up to 5 characters
    if (!text || text.trim()?.length < 6) return;
    // console.log(text);

    const detectedPins = text.match(RECHARGE_PIN_REGEX);
    if (detectedPins?.length) {
      // console.log("PINS", detectedPins);
      if (askForCodeConfirmation) {
        setDetectedPins(detectedPins);
        setCameraIsActive(false);
        confirmationSheetRef.current?.open();
      } else {
        // if confirm sheet is disabled, we dial the first match
        // which will be the longest detected pin
        const firstMatch = detectedPins[0];
        setCameraIsActive(false);
        handleConfirmPin(firstMatch);
      }
    }
  });

  const ocrProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const dt = Date.now();
      const result = scanOCR(frame).result;
      const dt2 = Date.now() - dt;
      console.log(dt2);

      processText(result.text);
    },
    [processText]
  );

  // !cameraIsActive && confirmationSheetRef.current?.open();
  // !detectedPins.length && setDetectedPins(["1111-1111-1111-11111"]);
  // cameraIsActive && setCameraIsActive(false);

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
  const handleConfirmPin = (pin: string) => {
    setDialingCode(true);
    pin = pin?.replace(/\D/gi, ""); // remove all non-digit
    const code = `${rechargePrefixCode}${pin}#`;
    console.log("FINAL PIN:", code);
    RNImmediatePhoneCall.immediatePhoneCall(code);
    setTimeout(() => setDialingCode(false), 3000);
  };

  /** Handles rescanning pin */
  const handleScanAgain = () => {
    setCameraIsActive(true);
    confirmationSheetRef.current?.close();
  };

  /** Called when confirm sheet is closed */
  const handleConfirmSheetClose = () => {
    setCameraIsActive(true);
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={handleTouchFocus}>
      <Camera
        ref={camera}
        pixelFormat="yuv"
        orientation="portrait"
        onInitialized={() => setCameraInitialized(true)}
        lowLightBoost={cameraDevice.supportsLowLightBoost}
        fps={format.maxFps || 3}
        enableBufferCompression
        frameProcessor={ocrProcessor}
        zoom={cameraDevice.neutralZoom}
        photo={false}
        video={false}
        torch={cameraTorch}
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
        <FrameGuide animating={cameraIsActive} onLayout={setCameraFocus} />
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
            loading={dialingCode}
            fill={false}
            icon={cameraTorch === "off" ? "ios-flash" : "ios-flash-off"}
          />
        </View>
      </View>

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
          onConfirm={handleConfirmPin}
          confirmBtnLoading={dialingCode}
          onScanAgain={handleScanAgain}
          onClose={handleConfirmSheetClose}
        />
      )}
    </View>
  );
}
