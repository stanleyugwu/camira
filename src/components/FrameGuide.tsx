import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import ThemeColors from "~constants/theme";
import tw from "~utils/tailwind";

const FOCUS_CURVE = 10;
const FRAME_GUIDE_STYLE = tw.style(`h-20 w-20`, {
  borderWidth: 5,
  borderColor: ThemeColors.primary,
  opacity: 0.5,
});

interface ChildFrameGuideProps {
  /** Determines whether to rotate the view `180deg` to the `x-axis` */
  flip?: boolean;
}

/* Represents the white focus mask border on the left*/
const LeftFrameGuide = ({ flip }: ChildFrameGuideProps) => (
  <View
    style={[
      FRAME_GUIDE_STYLE,
      {
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopStartRadius: FOCUS_CURVE,
        borderCurve: "circular",
      },
      flip && { transform: [{ rotateX: "180deg" }] },
    ]}
  />
);

/* Represents the white focus mask border on the right*/
const RightFrameGuide = ({ flip }: ChildFrameGuideProps) => (
  <View
    style={[
      FRAME_GUIDE_STYLE,
      {
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopEndRadius: FOCUS_CURVE,
        borderCurve: "circular",
      },
      flip && { transform: [{ rotateX: "180deg" }] },
    ]}
  />
);

export interface FrameGuideProps {
  /** Whether frame guide scanning animation is active */
  animating?: boolean;

  /**
   * Calls the given function, passing it the
   * `x` and `y` position of the center of Frame Guide view when it mounts
   */
  onLayout?: (pageX: number, pageY: number) => void;
}

/**
 * Renders a rectangular focus mask or frame guide view that looks
 * like this `[ ]`, typically above the camera to guide user's positioning
 *
 */
const FrameGuide = ({ onLayout, animating = true }: FrameGuideProps) => {
  const animatedTranslateX = useSharedValue(
    20 /* (w-20) width of FrameGuide right&left */
  );
  const [maskWidth, setMaxWidth] = useState(200);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: animatedTranslateX.value }],
    }),
    []
  );

  const handleContainerLayout = useCallback((evt: LayoutChangeEvent) => {
    const layout = evt.nativeEvent.layout;
    if (onLayout) {
      const viewCenters = [
        layout.x + layout.width / 2,
        layout.y + layout.height / 2,
      ];
      onLayout(viewCenters[0], viewCenters[1]);
    }
    const width = layout.width;
    setMaxWidth(width);
  }, []);

  useEffect(() => {
    animatedTranslateX.value = 20;
    if (animating) {
      animatedTranslateX.value = withRepeat(
        withTiming(maskWidth - 20, {
          easing: Easing.linear,
          duration: 800,
        }),
        -1,
        true
      );
    } else {
      console.log("STOP");

      cancelAnimation(animatedTranslateX);
    }
  }, [animating, maskWidth]);

  return (
    <View
      onLayout={handleContainerLayout}
      style={tw`w-full justify-center h-130 self-center mt-[60%] px-2`}
    >
      {/* Row 1 */}
      <View style={tw`flex-row justify-between items-center mb-10`}>
        <LeftFrameGuide />
        <RightFrameGuide />
      </View>

      <Animated.View
        style={[
          animatedStyle,
          tw`w-2 absolute h-100 self-start bg-accent opacity-80`,
        ]}
      />

      {/* Row 2 */}
      <View style={tw`flex-row justify-between items-center mt-10`}>
        <LeftFrameGuide flip />
        <RightFrameGuide flip />
      </View>
    </View>
  );
};

export default FrameGuide;
