import { useRouter } from "expo-router";
import { Animated, View, useAnimatedValue } from "react-native";
import Screen from "~components/Screen";
import tw from "~utils/tailwind";
import Icon from "@expo/vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import ThemeColors from "~constants/theme";
import handImg from "./assets/images/hand.png";
import Text from "~components/Text";
import RAnimated from "react-native-reanimated";
import EntranceAnimation from "~utils/EntranceAnimation";
import { useEffect, useMemo } from "react";
import FeatureCard from "./components/FeatureCard";
import TileImage from "./assets/images/tile.svg";

// images for features
import TopUp from "./assets/images/scan-top-up.svg";
import ScanDocument from "./assets/images/scan-document.svg";
import ScanQrCode from "./assets/images/scan-qrcode.svg";
import GenerateQrCode from "./assets/images/generate-qrcode.svg";
import SquishyButton from "~components/SquishyButton";

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
            inputRange: [0, 0.1, 0.7, 1],
            outputRange: ["0deg", "-30deg", "60deg", "0deg"],
            extrapolate: "extend",
          }),
        },
      ],
    };
  }, []);

  return (
    <Screen>
      {/* Settings Icon */}
      <SquishyButton
        onPress={() => router.push("/settings/")}
        entering={EntranceAnimation.fromRight.build()}
        style={tw`w-30 h-30 self-end`}
      >
        <Icon name="ios-cog-sharp" size={scale(32)} color={ThemeColors.black} />
      </SquishyButton>

      {/* Welcome Text */}
      <View>
        <RAnimated.View entering={EntranceAnimation.fromLeft.build()}>
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
        <RAnimated.View entering={EntranceAnimation.fromRight.build()}>
          <Text type="paragraph" color="gray" style={tw`-mt-3 ml-2`}>
            Through the Lens of Possibility
          </Text>
        </RAnimated.View>
      </View>

      {/* Cards container */}
      <View style={tw`mt-20`}>
        {/* First Row */}
        <View style={tw`flex-row justify-between`}>
          <FeatureCard
            delay={baseDelay}
            label="Top-Up Airtime"
            onPress={() => router.push("/top-up/")}
            featureImage={<TopUp />}
          />
          <FeatureCard
            delay={baseDelay * 2.5}
            label="Scan Document"
            onPress={() => router.push("/scan-document/")}
            featureImage={<ScanDocument />}
          />
        </View>

        {/* Second Row */}
        <View style={tw`flex-row justify-between mt-6`}>
          <FeatureCard
            delay={baseDelay * 3}
            label="Scan QR Code or Image"
            onPress={() => router.push("/scan-qrcode/")}
            featureImage={<ScanQrCode />}
          />
          <FeatureCard
            delay={baseDelay * 3.5}
            label="Generate QR Code or Image"
            onPress={() => router.push("/generate-qrcode/")}
            featureImage={<GenerateQrCode />}
          />
        </View>
      </View>
      <View style={[tw`absolute right-0 -bottom-30`, { zIndex: -1 }]}>
        <TileImage />
      </View>
    </Screen>
  );
}
