import { View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { scale } from "react-native-size-matters";
import Text from "~components/Text";
import tw from "~utils/tailwind";

/** This will be called internally and externally
 * to get the height of each item in the list.
 */
export const getItemHeight = (listHeight: number) => listHeight * 0.4;

export interface RenderDetectedPinProps {
  /** Pin text */
  item: string;

  /** Index of this item in the list */
  itemIndex: number;

  /** scrollY of list */
  listScrollY: SharedValue<number>;

  /** Hieght of the containing list */
  listHeight: number;
}

/** Renders each detected pin in a list */
const RenderDetectedPin = ({
  item,
  listScrollY,
  itemIndex,
  listHeight: LIST_HEIGHT,
}: RenderDetectedPinProps) => {
  const ITEM_HEIGHT = getItemHeight(LIST_HEIGHT);
  const EMPTY_ITEM_HEIGHT = (LIST_HEIGHT - ITEM_HEIGHT) / 2;

  // this will add a padding to the top and bottom of first
  // and last items in the list
  if (item === "EMPTY")
    return (
      <View
        style={{
          height: EMPTY_ITEM_HEIGHT,
        }}
      />
    );

  const animatedStyle = useAnimatedStyle(() => {
    const scrollYInputRange = [
      (itemIndex - 2) * ITEM_HEIGHT,
      (itemIndex - 1) * ITEM_HEIGHT,
      itemIndex * ITEM_HEIGHT,
    ];
    return {
      transform: [
        {
          scale: interpolate(
            listScrollY.value,
            scrollYInputRange,
            [0.7, 1, 0.7]
          ),
        },
      ],
      opacity: interpolate(listScrollY.value, scrollYInputRange, [0.6, 1, 0.6]),
    };
  });

  return (
    <View
      style={tw.style(`w-full justify-center items-center`, {
        height: ITEM_HEIGHT,
      })}
    >
      <Animated.View style={[animatedStyle, { width: "100%" }]}>
        <Text
          color="gray"
          type="subHeading"
          style={{
            fontFamily: "monospace",
            fontSize: scale(20),
            fontWeight: "bold",
          }}
        >
          {item}
        </Text>
      </Animated.View>
    </View>
  );
};

export default RenderDetectedPin;
