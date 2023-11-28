//import libraries
import React from "react";
import { View } from "react-native";
import Text from "~components/Text";
import Button from "~components/button";
import tw from "~utils/tailwind";

interface DefaultConfirmSheetActionButtonsProps {
  /** Called when the confirm button */
  onConfirm: () => void;

  /** Called when user wants to scan again */
  onScanAgain: () => void;

  /** Determines whether the confirm button is disabled */
  confirmBtnDisabled?: boolean;

  /** Determines whether the confirm button is in loading state */
  confirmBtnLoading?: boolean;
}

interface PropsWithEditVisible extends DefaultConfirmSheetActionButtonsProps {
  /** Determines whether the edit button is visible */
  hideEditButton?: false;

  /** Called when user presseds the `EDIT PIN` button */
  onEditPin: () => void;
}

interface PropsWithEditHidden extends DefaultConfirmSheetActionButtonsProps {
  /** Determines whether the edit button is visible */
  hideEditButton?: true;

  /** Not necessary as edit button is hidden */
  onEditPin?: never;
}

export type ConfirmSheetActionButtonsProps =
  | PropsWithEditHidden
  | PropsWithEditVisible;

/** Displays the action buttons for `rescanning`,
 * `confirming`, and `editing` pin, in the confirmation botom sheets
 */
const ConfirmSheetActionButtons = ({
  onConfirm,
  onEditPin,
  onScanAgain,
  hideEditButton = false,
  confirmBtnDisabled = false,
  confirmBtnLoading,
}: ConfirmSheetActionButtonsProps) => {
  return (
    <View style={tw`w-full mt-6 items-center justify-between`}>
      <View style={tw`items-center flex-row justify-center`}>
        <Button
          type="big"
          fill={false}
          label="Scan Again"
          onPress={onScanAgain}
          disabled={confirmBtnLoading}
          style={tw`mr-4`}
        />
        <Button
          type="big"
          fill
          loading={confirmBtnLoading}
          loadingText="Topping Up"
          icon="ios-checkmark-circle-outline"
          disabled={confirmBtnDisabled}
          label="Confirm"
          onPress={onConfirm}
          style={tw`ml-4`}
        />
      </View>
      {!hideEditButton && (
        <Text
          onPress={onEditPin}
          type="paragraph (bold)"
          color="accent"
          style={tw`mt-10`}
        >
          EDIT RECHARGE PIN
        </Text>
      )}
    </View>
  );
};

export default ConfirmSheetActionButtons;
