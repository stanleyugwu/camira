import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { ViewStyle } from "react-native";
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
  /** Determines whether frame guide `scanning` animation is currently running */
  animating?: boolean;

  /**
   * Calls the given function, passing it the
   * `x` and `y` position of the center of Frame Guide view when it mounts
   */
  onLayout?: (pageX: number, pageY: number) => void;

  /** Height of the frame guide in percentage or numbers */
  height: ViewStyle["height"];
}

/**
 * Renders a rectangular focus mask or frame guide view that looks
 * like this `[ ]`, typically above the camera to guide user's positioning
 *
 */
const FrameGuide = ({
  onLayout,
  animating = true,
  height,
}: FrameGuideProps) => {
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
      cancelAnimation(animatedTranslateX);
    }
  }, [animating, maskWidth]);

  return (
    <View
      style={[
        { pointerEvents: "none" },
        tw`absolute top-0 bottom-0 right-0 left-0 justify-center px-6`,
      ]}
    >
      <View
        onLayout={handleContainerLayout}
        style={{ height, justifyContent: "space-between" }}
      >
        {/* Row 1 */}
        <View style={tw`flex-row justify-between items-center`}>
          <LeftFrameGuide />
          <RightFrameGuide />
        </View>

        {animating && (
          <View
            style={tw`h-full justify-center absolute top-0 bottom-0 right-0 left-0`}
          >
            <Animated.View
              style={[
                animatedStyle,
                tw`w-2 h-[80%] self-start bg-accent opacity-80`,
              ]}
            />
          </View>
        )}

        {/* Row 2 */}
        <View style={tw`flex-row justify-between items-center`}>
          <LeftFrameGuide flip />
          <RightFrameGuide flip />
        </View>
      </View>
    </View>
  );
};

export default FrameGuide;
