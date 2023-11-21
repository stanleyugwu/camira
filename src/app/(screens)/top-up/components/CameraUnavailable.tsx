//import libraries
import { View } from "moti";
import React from "react";
import Text from "~components/Text";
import ANIMATIONS from "~constants/animation";
import tw from "~utils/tailwind";
import Constants from "expo-constants";

/**
 * displayed when the camera is not available
 */
const CameraUnavailable = () => {
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
        Camera Not Detected 😟
      </Text>
      <Text type="label" color="lightGray" style={tw`text-center mt-2`}>
        Hey! your device's camera wasn't detected, seems there's something wrong
        with it. This issue is not from our end, but here are some tips that may
        offer a fix:
      </Text>
      <View style={tw`mt-2 mx-2`}>
        <Text type="label (small)" style={tw`mt-1`} color="lightGray">
          1. Ensure you grant {appName} permission to your camera.
          <Text type="label (small)" color="accent">
            {"\n"}GRANT PERMISSION
          </Text>
        </Text>
        <Text type="label (small)" style={tw`mt-1`} color="lightGray">
          2. Open your device's camera manually to make sure it works
        </Text>
        <Text type="label (small)" style={tw`mt-1`} color="lightGray">
          3. Make sure your device hasn't run out of storage capacity
        </Text>
        <Text type="label (small)" style={tw`mt-1`} color="lightGray">
          4. Restart {appName}
        </Text>
      </View>
    </View>
  );
};

export default CameraUnavailable;
