//import libraries
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import { OCRFrame } from "@ismaelmoreiraa/vision-camera-ocr";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LogBox, View, StyleSheet } from "react-native";
import Text from "~components/Text";
import loader from "~assets/json/loader.json";
import AnimatedLottieView from "lottie-react-native";
import tw from "~utils/tailwind";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/Ionicons";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";
import Button from "~components/button";
import Toast from "~utils/toast";
import Clipboard from "@react-native-community/clipboard";

// FIXME: remove this before prod build
LogBox.ignoreLogs([/session\/camera-not-ready/]);
type OCRResult = OCRFrame["result"];
export type TextBlocks = OCRResult["blocks"];
// Loader
const Loader = () => (
  <View style={tw`self-center items-center justify-center flex-1`}>
    <AnimatedLottieView
      source={loader}
      duration={1500}
      useNativeLooping
      autoPlay
      loop
      style={tw`h-22 w-22`}
    />
    <Text type="label" color="lightGray">
      Processing Text
    </Text>
  </View>
);

interface NoTextDetectedProps {
  onScanAgain: () => void;
}

// shown when no text was detected
const NoTextDetected = ({ onScanAgain }: NoTextDetectedProps) => (
  <View style={tw`items-center mt-10`}>
    <Icon
      name="eye-off-outline"
      color={ThemeColors.lightGray}
      size={scale(36)}
    />
    <Text color="lightGray" type="label" style={tw`text-center`}>
      <Text type="paragraph (bold)" color="lightGray">
        No text detected.
      </Text>
      {"\n"}
      Maybe your camera is shy :). Please re-position the document and give it
      one more shot!
    </Text>
    <Button
      type="small"
      style={tw`mt-4`}
      icon="scan-outline"
      label="Scan Again"
      onPress={onScanAgain}
    />
  </View>
);

/**
 * Calculates the font sizes for all the __words/elements__ in the given text block based on
 * their heights, and returns a lookup table for retreiving size of each height.
 * Essentially a mapping btw height and font size.
 *
 * __NOTE ON APPROACH:__
 *
 * The approach to calculating the formatting (**sizing**) is to
 * clamp the set of heights of all detected words/elements
 * to the `size range` of __14-36__ which will be their font sizes.
 *
 * The heights are first deduped and then sorted for processing.
 * With example deduped and sorted heights `heights = [18,20,26,32,34,46]`, the output
 * font sizes will be `sizes = [14, ... , 36]` (the smallest height _18_ will be _14_ and biggest _46_ => _36_).
 *
 * Numbers in `sizes` will increase linearly by a _conditionally-incremented_ factor `size increment` which
 * is calculated by `size range` range / `heights len` (`heights` items count), i.e __(36-14)/6__ _(6 = `heights`.length)_.
 * E.g for heights `heights` and a `size increment` of _2_ `sizes` will become `[14, 16, 18, 20, 22, 24]`.
 *
 * Grouping is also applied to the heights where if the difference btw two adjacent
 * heights are minimal (less than a constant `diff thres`), they'll take the same font size.
 * E.g for `[18, 20]`, since their difference is _2_ __(20-18)__, and _18_ is first height, '
 * they'll both take size of _14_.
 *
 * When grouping is performed on two adjacent heights, the `size increment` factor is increased a bit
 * by `size range` / (`heights len` / 2) i.e __(36-14) / (6/2)__.
 * The reason for this slight increase is so to have a significant difference in font size between
 * the last height which is grouped and the next height which is not.
 *
 * E.g for `[18,20,26,32]` (assuming _5_ as `diff thres`), grouping is applied for _18_,_20_ but not
 * for _26_ (cus __(26-20) > 5__). So the accumulated increments - done when grouping _18_,_20_ - to the
 * `size increment` will reflect on the size of height _26_.
 * When grouping is not done, numbers in `sizes` just increase linearly by `size increment`.
 */
const calculateSizes = (blocks: TextBlocks): Record<`${number}`, number> => {
  // sorted and deduped words heights
  let heights = Array.from(
    new Set(
      blocks
        ?.map((block) =>
          block?.lines?.map((line) =>
            line?.elements?.map((word) => word?.frame?.width)
          )
        )
        .flat(2)
        .sort((a, b) => a - b)
    )
  );

  // minimum and maximum font sizes.
  const maxSize = 36,
    minSize = 14;

  // font size range
  const sizeRange = maxSize - minSize;

  const heightsLen = heights.length;
  const staticSizeIncrement = sizeRange / heightsLen; // we need this for growing size increment
  let sizeIncrement = staticSizeIncrement;
  const diffThres = 5; // the higher this number, the more aggressive the grouping

  // sizes lookup table
  const sizes: Record<`${number}`, number> = {};

  for (
    let idx = 0, groupNextHeight = false, curSize = minSize;
    idx < heightsLen;
    idx++
  ) {
    const curHeight = heights[idx];

    // first height should just be the minimum size
    if (idx === 0) {
      sizes[curHeight] = minSize;
      continue;
    }

    const nextHeight = heights[idx + 1];

    if (groupNextHeight) {
      sizes[curHeight] = curSize; // set to previous height's size
      sizeIncrement += staticSizeIncrement / 2; // slighly increment `size increment`
    } else sizes[curHeight] = curSize += sizeIncrement; // set to new increased size

    // calculate whether next height in next iteration
    // should be grouped (should take the current `curSize`)
    const heightDiff = nextHeight && nextHeight - curHeight;
    groupNextHeight = heightDiff < diffThres ? true : false;
  }

  return sizes;
};

/**
 * Transforms the `blocks` of detected texts to formatted texts
 * and invokes the given `callback` wih the result
 */
const processBlocks = (
  /** Blocks of text */
  blocks: TextBlocks,
  callback: (result: React.JSX.Element | null) => void
): void => {
  if (!blocks?.length /* if block is null or []*/) return callback(null);
  const fontSizes = calculateSizes(blocks);
  callback(
    <>
      {blocks?.map((block, bIdx) => (
        <View style={tw`mb-2 flex-1`} /*key={`block-${bIdx}`}*/>
          {block?.lines?.map((line, lIdx) => {
            return (
              <View style={[tw`flex-row flex-wrap`]} /*key={`line-${lIdx}`}*/>
                {line.elements?.map((word, wIdx) => {
                  const wordHeight = word.frame.width;
                  const fontSize = fontSizes[wordHeight];
                  return (
                    <Text
                      //key={`word-${wIdx}`}
                      adjustsFontSizeToFit
                      allowFontScaling={false}
                      selectable
                      selectionColor={ThemeColors.primary}
                      suppressHighlighting
                      style={{ fontSize, lineHeight: fontSize }}
                    >
                      {word.text + " "}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
};

interface ScanResultProps {
  /** Called when sheet is closed through **done** button */
  onClose: () => void;
}

export interface ScanResultMethods {
  /**
   * Called to pop out the scan result sheet and begin
   * processing given `result`.
   */
  show(result: OCRResult): void;
}

/**
 * Shows the result of a document scan with formatting applied
 */
const ScanResult = forwardRef<ScanResultMethods, ScanResultProps>(
  ({ onClose }, ref) => {
    const sheetRef = useRef<BottomSheetMethods>();
    const rawText = useRef<string>();
    const [processing, setProcessing] = useState(false);
    const [processedTextElement, setProcessedTextElement] =
      useState<React.ReactNode | null>(null);

    useImperativeHandle(ref, () => ({
      show(scanResult) {
        const handleProcessedResult = (result: React.JSX.Element) => {
          setProcessedTextElement(result);
          setProcessing(false);
        };

        // kick off processing
        setProcessing(true);
        sheetRef.current?.open();

        /*
         * We make this call in a timeout to prevent blocking thread and freezing screen
         * on the camera view when snap button is pressed. Without this
         * timeout call, sheet won't open until `processBlocks` finishes
         * and also loader won't show.
         *
         * But with this, as soon as `show` is called, `processBlock` is shifted to
         * event queue and doesn't block the thread. So sheet can open smoothly.
         */
        // TODO: find a way to run this function on UI or separate thread
        setTimeout(
          () => processBlocks(scanResult?.blocks, handleProcessedResult),
          300
        );
        rawText.current = scanResult?.text;
      },
    }));

    // reset states and free memories
    const reset = useCallback(() => {
      sheetRef.current?.close(); // this will then trigger `onClose` callback prop
      setProcessedTextElement(null);
      setProcessing(false);
      rawText.current = undefined;
    }, []);

    const copyText = () => {
      if (rawText.current && !processing) {
        Clipboard.setString(rawText.current);
        Toast.show("success", undefined, "Text copied successfully", {
          position: "bottom",
        });
      }
    };

    return (
      <BottomSheet
        ref={sheetRef}
        backdropMaskColor={"transparent"}
        height={"95%"}
        android_closeOnBackPress={false}
        hideDragHandle
        closeOnBackdropPress={false}
        onClose={onClose}
        style={tw`rounded-t-md bg-primary`}
      >
        <View style={tw`flex-row items-center justify-between px-6 py-4`}>
          <Text
            type="paragraph (bold)"
            color="lightGray"
            style={tw`text-center flex-1`}
          >
            Scan Result
          </Text>
          <Text onPress={reset} type="label" color="accent">
            Done
          </Text>
        </View>
        {/* Tools pane */}
        <View
          style={tw`items-center box-shadow border-b border-primary justify-end flex-row bg-secondary p-3 mx-3`}
        >
          <View
            style={[
              tw`h-full mx-3`,
              {
                borderWidth: StyleSheet.hairlineWidth,
                height: "100%",
                borderColor: ThemeColors.lightGray,
              },
            ]}
          />
          <Icon
            name="ios-copy-sharp"
            size={scale(18)}
            color={ThemeColors.accent}
            onPress={copyText}
          />
        </View>
        {/* Text display */}
        <View
          style={tw`justify-start bg-secondary flex-1 box-shadow mx-3 pt-2`}
        >
          {processing ? (
            <Loader />
          ) : !processedTextElement ? (
            <NoTextDetected onScanAgain={reset} />
          ) : (
            <ScrollView style={tw`px-3 flex-1`}>
              {processedTextElement}
            </ScrollView>
          )}
        </View>
      </BottomSheet>
    );
  }
);

export default ScanResult;
