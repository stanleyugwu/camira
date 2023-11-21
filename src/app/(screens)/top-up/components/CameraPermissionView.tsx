import Constants from "expo-constants";
import { View } from "moti";
import Text from "~components/Text";
import Button from "~components/button";
import ANIMATIONS from "~constants/animation";
import tw from "~utils/tailwind";

interface CameraPermissionViewProps {
  /** Called when permission is requested by user */
  onRequest: () => Promise<boolean>;
}
/**
 * View to show when camera permission is not granted
 */
const CameraPermissionView = ({ onRequest }: CameraPermissionViewProps) => {
  const appName = Constants.expoConfig.name;

  return (
    <View
      from={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        delay: ANIMATIONS.BASE_DELAY,
        duration: 500,
        type: "timing",
      }}
      style={tw`box-shadow items-center justify-center bg-secondary mx-6 p-4 h-1/2 self-center`}
    >
      <Text color="gray" type="paragraph" style={tw`text-center`}>
        Hey! {appName} needs permission to access your camera
      </Text>
      <Text type="label" color="lightGray" style={tw`text-center mt-2`}>
        Hey! there's nothing fishy, you just need to grant {appName} permission
        to your camera to enable you experience seamless snap top-ups!
      </Text>
      <Button
        style={tw`mt-10`}
        onPress={() => onRequest()}
        label="Grant Permission"
        type="big"
        fill={false}
        iconName="ios-lock-open"
      />
    </View>
  );
};

export default CameraPermissionView;
