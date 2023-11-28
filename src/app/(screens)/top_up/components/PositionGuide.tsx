//import libraries
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import Text from "~components/Text";
import tw from "~utils/tailwind";

/** Shows text to guide user on how to position
 * the recharge card in the camera
 */
const PositonGuide = () => {
  const [textGuideVisible, setTextGuideVisible] = useState(true);

  // hide tet guide after 8 seconds
  useEffect(() => {
    setTimeout(() => {
      setTextGuideVisible(false);
    }, 8000);
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      {textGuideVisible && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 500 }}
          exit={{ opacity: 0 }}
          style={tw`mt-20`}
        >
          <Text color="primary" type="label" style={tw`text-center`}>
            Point your camera to your recharge card(s) for auto top-up, and try
            to position the card within the position guide above.
          </Text>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default PositonGuide;
