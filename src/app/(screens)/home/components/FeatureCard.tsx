//import libraries
import React from "react";
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
  delay = 300,
}: FeatureCardProps) => {
  return (
    <SquishyButton
      entering={ANIMATIONS.Entrance.fromDown.delay(delay).build()}
      style={tw`box-shadow justify-center items-center bg-secondary w-140 h-140 rounded-lg`}
      onPress={onPress}
    >
      {FeatureImage}
      <Text type="label" style={tw`mt-4 mx-4 text-center`}>
        {label}
      </Text>
    </SquishyButton>
  );
};

export default FeatureCard;
