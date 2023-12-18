import { useRouter } from "expo-router";
import { Animated, View, useAnimatedValue } from "react-native";
import Screen from "~components/Screen";
import tw from "~utils/tailwind";
import handImg from "./assets/images/hand.png";
import Text from "~components/Text";
import RAnimated from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import FeatureCard from "./components/FeatureCard";
import TileImage from "./assets/images/tile.svg";

// images for features
import TopUp from "./assets/images/scan-top-up.svg";
import ScanDocument from "./assets/images/scan-document.svg";
import SavedDocuments from "./assets/images/saved-documents.svg";
import SettingsIcon from './assets/images/settings.svg'

import SquishyButton from "~components/SquishyButton";
import ANIMATIONS from "~constants/animation";

const baseDelay = 300;

export default function Home() {
  const router = useRouter();
  const animatedValue = useAnimatedValue(0);

  // effect to kick off hand wave animation on mount
  useEffect(() => {
    const wave = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          delay: 1500,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };
    wave();
    const intervalId = setInterval(wave, 8000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // hand wave animated styles
  const animatedHandStyle = useMemo(() => {
    return {
      transform: [
        {
          rotate: animatedValue.interpolate({
            inputRange: [0, 0.1, 0.7, 0.9, 1],
            outputRange: ["0deg", "-30deg", "60deg", "30deg", "0deg"],
            extrapolate: "extend",
          }),
        },
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
            extrapolate: "extend",
          }),
        },
      ],
    };
  }, []);

  return (
    <>
      <Screen>
        {/* Settings Icon */}
        <SquishyButton
          onPress={() => router.push("/settings/")}
          entering={ANIMATIONS.Entrance.fromRight.build()}
          style={tw`w-30 h-30 self-end`}
        >
          <SettingsIcon/>
        </SquishyButton>

        {/* Welcome Text */}
        <View>
          <RAnimated.View entering={ANIMATIONS.Entrance.fromLeft.build()}>
            <View style={tw`flex-row items-center`}>
              <Animated.Image
                source={handImg}
                style={[tw`w-50 h-50`, animatedHandStyle]}
              />
              <Text type="heading" style={tw`mt-4`}>
                Hello, Welcome
              </Text>
            </View>
          </RAnimated.View>
          <RAnimated.View entering={ANIMATIONS.Entrance.fromRight.build()}>
            <Text type="paragraph" color="gray" style={tw`ml-2`}>
              Through the Lens of Possibility
            </Text>
          </RAnimated.View>
        </View>

        {/* Cards container */}
        {/* First Row */}
        <View style={tw`justify-center items-center max-w-300 mt-10`}>
          <FeatureCard
            delay={baseDelay}
            label="Top-Up Airtime"
            description="Top-up airtime by snapping instead of typing. Reload in a snap!"
            onPress={() => router.push("/top_up/")}
            featureImage={<TopUp />}
          />
          <FeatureCard
            delay={baseDelay * 2}
            label="Scan Document"
            description="Transform physical documents into digital texts in a snap!"
            onPress={() => router.push("/scan_document/")}
            featureImage={<ScanDocument />}
          />
          <FeatureCard
            delay={baseDelay * 3}
            label="Saved Documents"
            description="View all your saved documents"
            onPress={() => router.push("/saved_documents/")}
            featureImage={<SavedDocuments />}
          />
        </View>
      </Screen>
      <View style={[tw`absolute right-0 -bottom-35`]}>
        <TileImage />
      </View>
    </>
  );
}
