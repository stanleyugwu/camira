import {
  View,
  ViewabilityConfigCallbackPairs,
  useWindowDimensions,
} from "react-native";
import tw from "~utils/tailwind";
import ONBOARDING_SCENES, { Scene } from "./data";
import RenderItem from "./components/RenderItem";
import NextButton from "./components/NextButton";
import { useRef, useState } from "react";
import PaginationDots from "./components/PaginationDots";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const listRef = useAnimatedRef<Animated.FlatList<Scene>>();

  // handles syncing scrollX with list scroll offset
  const handleScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollX.value = event.contentOffset.x;
    },
  });

  // configures list viewability and
  // handles updating currentListIndex when list is scrolled
  const viewabilityConfig = useRef<
    | ViewabilityConfigCallbackPairs
    | Animated.SharedValue<ViewabilityConfigCallbackPairs>
  >([
    {
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 100,
        minimumViewTime: 0,
      },
      onViewableItemsChanged: (info) => {
        setCurrentListIndex(info.viewableItems[0]?.index || 0);
      },
    },
  ]).current;

  // handles scrolling list via button
  const handleNext = () => {
    const isLastScene = currentListIndex + 1 === ONBOARDING_SCENES.length;
    if (isLastScene) {
      // reached last scene in list
      router.replace("/home/");
    }
    else
    // @ts-expect-error
      listRef.current?.scrollToIndex({
        index: currentListIndex + 1,
        animated: true,
      });
  };

  return (
    <View style={tw`flex-1`}>
      <Animated.FlatList
        style={{ flex: 0.7 }}
        data={ONBOARDING_SCENES}
        onScroll={handleScroll}
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfig}
        renderItem={({ index, item }) => (
          <RenderItem
            scrollX={scrollX}
            sceneWidth={SCREEN_WIDTH}
            index={index}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <View
        style={tw.style(
          { flex: 0.3 },
          "flex-row justify-between mx-6 items-center"
        )}
      >
        <PaginationDots
          scrollX={scrollX}
          scenesLength={ONBOARDING_SCENES.length}
          sceneWidth={SCREEN_WIDTH}
        />
        <NextButton
          onPress={handleNext}
          percentage={(currentListIndex + 1) * (100 / ONBOARDING_SCENES.length)}
        />
      </View>
    </View>
  );
}
