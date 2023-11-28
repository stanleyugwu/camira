//import libraries
import React, { forwardRef, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import BottomSheet, { BottomSheetProps } from "~components/BottomSheet";
import tw from "~utils/tailwind";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";
import ConfirmSheetActionButtons, {
  ConfirmSheetActionButtonsProps,
} from "./ConfirmSheetActionButtons";

export type SinglePinConfirmSheetProps = Pick<
  ConfirmSheetActionButtonsProps,
  "onScanAgain" | "confirmBtnLoading"
> & {
  /** The detected pin to display in the input box */
  detectedPin: string;

  /** Called with the final pin when user confirms it */
  onConfirm: (pin: string) => void;

  /** Called when the sheet is closed */
  onClose?: BottomSheetProps["onClose"];
};

/** Shos a bottom sheet for confirming detected single recharge pin */
const SinglePinConfirmSheet = forwardRef<
  BottomSheetMethods,
  SinglePinConfirmSheetProps
>(({ onConfirm, onScanAgain, onClose, detectedPin }, ref) => {
  const inputRef = useRef<TextInput>();
  const [editingPin, setEditingPin] = useState(false);
  const [inputValue, setInputValue] = useState(detectedPin);

  return (
    <BottomSheet
      ref={ref}
      backdropMaskColor={"transparent"}
      height={"60%"}
      title="CONFIRM THE RECHARGE PIN"
      onClose={onClose}
    >
      <View style={tw`w-full mt-8`}>
        <TextInput
          ref={inputRef}
          editable={editingPin}
          focusable={editingPin}
          enabled={editingPin}
          autoFocus={editingPin}
          onChangeText={setInputValue}
          cursorColor={ThemeColors.accent}
          dataDetectorTypes={"none"}
          enablesReturnKeyAutomatically
          enterKeyHint="done"
          inputMode="numeric"
          maxLength={25}
          keyboardType="numeric"
          placeholderTextColor={"#aab"}
          style={[
            tw`text-gray font-bold text-center bg-primary p-5 border border-[#bbb] rounded-md w-full`,
            { fontSize: scale(20), fontFamily: "monospace" },
          ]}
          placeholder="Enter Recharge Pin"
          value={inputValue || detectedPin}
        />
        <ConfirmSheetActionButtons
          onConfirm={() => onConfirm(inputValue)}
          onEditPin={() => {
            setEditingPin(true);
            inputRef.current?.focus();
          }}
          onScanAgain={onScanAgain}
          confirmBtnDisabled={inputValue?.length < 8}
        />
      </View>
    </BottomSheet>
  );
});

export default SinglePinConfirmSheet;
