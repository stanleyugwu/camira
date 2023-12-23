//import libraries
import React from "react";
import { View } from "react-native";
import SquishyButton from "~components/SquishyButton";
import Text from "~components/Text";
import ANIMATIONS from "~constants/animation";
import tw from "~utils/tailwind";

interface FeatureCardProps {
  /**
   * imported Image of the feature
   */
  featureImage: JSX.Element;

  /**
   * Text label of the feature
   */
  label: string;

  /**
   * Text description of the feature
   */
  description: string;

  /**
   * Called when the card is pressed
   */
  onPress: () => void;

  /**
   * Number of milliseconds to delay the entrance transition animation
   */
  delay: number;
}

/**
 * Pressable card for displaying single app feature in home screen
 */
const FeatureCard = ({
  featureImage: FeatureImage,
  label,
  onPress,
  description,
  delay = 300,
}: FeatureCardProps) => {
  return (
    <SquishyButton
      entering={ANIMATIONS.Entrance.fromDown.delay(delay).build()}
      style={tw`box-shadow flex-row justify-between items-center bg-secondary w-full h-100 rounded-lg my-2 px-4`}
      onPress={onPress}
    >
      {FeatureImage}
      <View style={tw`flex-1 ml-4`}>
        <Text type="paragraph (bold)" color="gray">
          {label}
        </Text>
        <Text type="label (small)" color="lightGray">{description}</Text>
      </View>
    </SquishyButton>
  );
};

export default FeatureCard;
