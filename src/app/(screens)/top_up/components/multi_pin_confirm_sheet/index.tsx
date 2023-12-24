//import libraries
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { View, ViewabilityConfigCallbackPairs } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import BottomSheet from "~components/BottomSheet";
import tw from "~utils/tailwind";
import ConfirmSheetActionButtons from "../ConfirmSheetActionButtons";
import { SinglePinConfirmSheetProps } from "../SinglePinConfirmSheet";
import Text from "~components/Text";
import { verticalScale } from "react-native-size-matters";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import RenderDetectedPin, {
  getItemHeight,
} from "./components/RenderDetectedPin";
import ListScrollButton, { ListScroller } from "./components/ListScrollButton";

// constants
const EMPTY = "EMPTY";
export const LIST_HEIGHT = verticalScale(100);

type MultiPinConfirmSheetProps = {
  /** Detected pins for user to confirm */
  detectedPins: SinglePinConfirmSheetProps["detectedPin"][];
  /** Called when a pin from the list is confirmed by user */
  onConfirm: (
    /** The pin thta was confirmed */
    confirmedPin: string,
    /** Whether the confirmed pin is the last in the list */
    isLastPin: boolean
  ) => void;
} & Pick<
  SinglePinConfirmSheetProps,
  "onClose" | "onScanAgain" | "confirmBtnLoading"
>;

/** Shos a bottom sheet for confirming detected single top-up pin */
const MultiPinConfirmSheet = forwardRef<
  BottomSheetMethods,
  MultiPinConfirmSheetProps
>(
  (
    { onConfirm, onScanAgain, onClose, detectedPins, confirmBtnLoading },
    ref
  ) => {
    const [listCurrentItemIdx, setListCurrentItemIdx] = useState(0);
    // slightly modified pin
    const [pins, setPins] = useState(detectedPins);
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

    // handles crolling list up or down
    const scrollList: ListScroller = (direction) => {
      const nextIdx =
        direction === "up"
          ? Math.min(listCurrentItemIdx + 1, pins.length - 1)
          : Math.max(listCurrentItemIdx - 1, 0);

      listRef.current?.scrollToIndex({
        index: nextIdx,
        animated: true,
      });
    };

    const handlePinConfirmation = () => {
      // delete pin from internal list,
      // then call onConfirm callback
      const pinsCopy = [...pins];
      pinsCopy?.splice(listCurrentItemIdx, 1);
      onConfirm(pins[listCurrentItemIdx], pinsCopy.length === 0);
      setPins(pinsCopy);
    };

    const pinsWithEmptyItems = [
      EMPTY /* <= This is to add padding to the top of the first item*/,
      ...pins,
      EMPTY /* <= This is to add padding to the bottom of the last item*/,
    ];

    // handles keeping internal pins state in sync
    // with external detected pins
    useEffect(() => {
      setPins(detectedPins);
    }, [detectedPins?.length]);

    return (
      <BottomSheet
        ref={ref}
        backdropMaskColor={"transparent"}
        height={"60%"}
        title="CONFIRM THE TOP-UP PIN"
        onClose={onClose}
      >
        {/* TODO: Convert this `View` to component and re-use across app */}
        <View style={tw`p-2 bg-primary rounded-md mt-3`}>
          <Text color="lightGray" type="label" style={tw`text-center`}>
            Multiple valid top-up pins were detected, please confirm the valid
            pin. You can confirm multiple pins to top-up multiple times.
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
              data={pinsWithEmptyItems}
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
            <ListScrollButton hidden={pins?.length < 2} scroll={scrollList} />
          </View>

          <ConfirmSheetActionButtons
            onConfirm={handlePinConfirmation}
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
