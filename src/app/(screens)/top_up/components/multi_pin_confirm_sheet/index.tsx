//import libraries
import React, { forwardRef, useMemo, useRef, useState } from "react";
import { View, ViewabilityConfigCallbackPairs } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import BottomSheet from "~components/BottomSheet";
import tw from "~utils/tailwind";
import ConfirmSheetActionButtons from "../ConfirmSheetActionButtons";
import { SinglePinConfirmSheetProps } from "../SinglePinConfirmSheet";
import Text from "~components/Text";
import Icon from "@expo/vector-icons/Ionicons";
import SquishyButton from "~components/SquishyButton";
import { scale, verticalScale } from "react-native-size-matters";
import ThemeColors from "~constants/theme";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import RenderDetectedPin, {
  getItemHeight,
} from "./components/RenderDetectedPin";

// constants
const EMPTY = "EMPTY";
export const LIST_HEIGHT = verticalScale(100);

type MultiPinConfirmSheetProps = {
  /** Detected pins for user to confirm */
  detectedPins: SinglePinConfirmSheetProps["detectedPin"][];
} & Pick<
  SinglePinConfirmSheetProps,
  "onClose" | "onConfirm" | "onScanAgain" | "confirmBtnLoading"
>;

/** Shos a bottom sheet for confirming detected single recharge pin */
const MultiPinConfirmSheet = forwardRef<
  BottomSheetMethods,
  MultiPinConfirmSheetProps
>(
  (
    { onConfirm, onScanAgain, onClose, detectedPins, confirmBtnLoading },
    ref
  ) => {
    const [listCurrentItemIdx, setListCurrentItemIdx] = useState(0);
    const listRef = useRef<FlatList>();
    const listscrollY = useSharedValue(0);
    const onPinListScroll = useAnimatedScrollHandler({
      onScroll(evt) {
        listscrollY.value = evt.contentOffset.y;
      },
    });

    // cached viewability config pair
    const viewabilityConfig = useRef<ViewabilityConfigCallbackPairs>([
      {
        onViewableItemsChanged(info) {
          setListCurrentItemIdx(info?.viewableItems?.[0]?.index || 0);
        },
        viewabilityConfig: {
          viewAreaCoveragePercentThreshold: 10,
          minimumViewTime: 0,
        },
      },
    ]).current;

    const ITEM_HEIGHT = getItemHeight(LIST_HEIGHT);

    // slightly modified pin
    const pins = useMemo(
      () => [
        EMPTY /* <= This is to add padding to the top of the first item*/,
        ...detectedPins,
        EMPTY /* <= This is to add padding to the bottom of the last item*/,
      ],
      [detectedPins.length]
    );

    // handles crolling list up or down
    const scrollList = (direction: "up" | "down") => {
      return () => {
        const nextIdx =
          direction === "up"
            ? Math.min(listCurrentItemIdx + 1, pins.length - 1)
            : Math.max(listCurrentItemIdx - 1, 0);

        listRef.current?.scrollToIndex({
          index: nextIdx,
          animated: true,
        });
      };
    };

    return (
      <BottomSheet
        ref={ref}
        backdropMaskColor={"transparent"}
        height={"60%"}
        title="CONFIRM THE RECHARGE PIN"
        onClose={onClose}
      >
        {/* TODO: Convert this `View` to component and re-use across app */}
        <View style={tw`p-2 bg-primary rounded-md mt-3`}>
          <Text color="lightGray" type="label" style={tw`text-center`}>
            Multiple valid recharge pins were detected from the scan, please
            confirm the correct pin
          </Text>
        </View>
        <View style={tw`w-full mt-8`}>
          <View style={tw`w-full flex-row justify-between items-center`}>
            <Animated.FlatList
              // @ts-expect-error
              ref={listRef}
              snapToInterval={ITEM_HEIGHT}
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEventThrottle={16}
              decelerationRate={"fast"}
              viewabilityConfigCallbackPairs={viewabilityConfig}
              onScroll={onPinListScroll}
              style={[{ height: LIST_HEIGHT }]}
              data={pins}
              contentContainerStyle={tw`items-center w-full`}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <RenderDetectedPin
                  listHeight={LIST_HEIGHT}
                  item={item}
                  itemIndex={index}
                  listScrollY={listscrollY}
                />
              )}
            />
            <View style={tw`ml-2`}>
              <SquishyButton onPress={scrollList("up")}>
                <Icon
                  name="ios-chevron-up"
                  size={scale(26)}
                  color={ThemeColors.accent}
                />
              </SquishyButton>
              <View
                style={tw.style("bg-primary w-full my-1", {
                  height: 2,
                })}
              />
              <SquishyButton onPress={scrollList("down")}>
                <Icon
                  name="ios-chevron-down"
                  size={scale(26)}
                  color={ThemeColors.accent}
                />
              </SquishyButton>
            </View>
          </View>

          <ConfirmSheetActionButtons
            onConfirm={() => {
              onConfirm(pins[listCurrentItemIdx + 1]);
            }}
            hideEditButton
            confirmBtnLoading={confirmBtnLoading}
            onScanAgain={onScanAgain}
          />
        </View>
      </BottomSheet>
    );
  }
);

export default MultiPinConfirmSheet;
