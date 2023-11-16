//import libraries
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import _BottomSheet, {
  BottomSheetProps as _BottomSheetProps,
  BottomSheetMethods,
} from "@devvie/bottom-sheet";
import Icon from "@expo/vector-icons/Ionicons";
import Text from "~components/Text";
import { scale } from "react-native-size-matters";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";
import ANIMATIONS from "~constants/animation";
import { View } from "react-native";

export interface BottomSheetProps extends _BottomSheetProps {
  /**
   * Title text to show below sheet handle bar
   */
  title: string;

  /**
   * Optional sub-title to show below title
   */
  subTitle?: string;

  /**
   * Whether to show close icon right to the sheet
   */
  showCloseIcon?: boolean;

  /**
   * Children from parent
   */
  children: React.ReactNode;
}

/**
 * Wraps `BottomSheet` from `@devvie/bottom-sheet`
 * with some preset, app-tailored composition and props
 */
const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(
  (
    {
      children,
      title,
      showCloseIcon,
      style,
      subTitle,
      ...otherProps
    }: BottomSheetProps,
    ref
  ) => {
    const sheetRef = useRef<BottomSheetMethods>();

    // this is to allow handleClose work internally here without having
    // onCloseIconPress prop
    useImperativeHandle(ref, () => {
      return {
        close: sheetRef.current?.close,
        open: sheetRef.current?.open,
      };
    });
    const handleClose = () => sheetRef.current.close();

    return (
      <_BottomSheet
        closeDuration={ANIMATIONS.BASE_DURATION}
        hideDragHandle={showCloseIcon}
        ref={sheetRef}
        style={tw.style(`bg-secondary rounded-t-xl`, style)}
        {...otherProps}
      >
        {showCloseIcon && (
          <Icon
            name="ios-close-outline"
            size={scale(23)}
            style={tw`self-end`}
            color={ThemeColors.gray}
            onPress={handleClose}
          />
        )}
        <View style={tw`px-6 items-center`}>
          <Text
            type="paragraph (bold)"
            color="gray"
            style={tw.style("text-center", subTitle ? "mt-3" : "my-3")}
          >
            {title}
          </Text>
          {subTitle && (
            <Text type="label" color="gray" style={tw`mb-4 text-center`}>
              {subTitle}
            </Text>
          )}
          {children}
        </View>
      </_BottomSheet>
    );
  }
);

export default BottomSheet;
