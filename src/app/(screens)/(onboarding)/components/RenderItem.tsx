//import libraries
import React, { useEffect } from "react";
import { View } from "react-native";
import { Scene } from "../data";
import tw from "~utils/tailwind";
import Text from "~components/Text";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface RenderItemProps {
  index: number;
  item: Scene;
  sceneWidth: number;
  scrollX: SharedValue<number>;
}

// Renders each onboarding scene
const RenderItem = ({ index, item, sceneWidth, scrollX }: RenderItemProps) => {
  const animatedBounceValue = useSharedValue(0);
  const scrollXInputRange = [
    (index - 1) * sceneWidth,
    index * sceneWidth,
    (index + 1) * sceneWidth,
  ];
  const animatedImageStyles = useAnimatedStyle(() => {
    const animatedTranslateY = interpolate(
      scrollX.value,
      scrollXInputRange,
      [150, 0, 150],
      Extrapolate.CLAMP
    );

    const animatedOpacity = interpolate(
      scrollX.value,
      scrollXInputRange,
      [0, 1, 0]
    );

    return {
      opacity: animatedOpacity,
      transform: [
        {
          translateY: animatedTranslateY,
        },
      ],
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const animatedTranslateY = interpolate(
      scrollX.value,
      scrollXInputRange,
      [350, 0, 350],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: animatedTranslateY }],
    };
  });

  // runs bounce animation on mount.
  // useAnimatedStyles didn't work so we use shared value
  useEffect(() => {
    animatedBounceValue.value = withRepeat(
      withTiming(20, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  return (
    <View
      style={tw.style("items-center justify-around pt-4", {
        flex: 1,
        width: sceneWidth,
      })}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: animatedBounceValue,
              },
            ],
          },
        ]}
      >
        <Animated.Image
          source={item.featureImg}
          style={[
            { width: sceneWidth * 0.5, height: sceneWidth * 0.5 },
            animatedImageStyles,
          ]}
        />
      </Animated.View>
      <View style={tw`items-center mx-6`}>
        <Animated.View style={[animatedTextStyle]}>
          <Text
            type="heading"
            style={tw`text-center mb-3 text-[${item.titleColor}]`}
          >
            {item.title}
          </Text>
          <Text type="paragraph" style={tw`text-center`}>
            {item.paragraph}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default RenderItem;
