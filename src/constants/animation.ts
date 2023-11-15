import {
  ComplexAnimationBuilder,
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

const BASE_DURATION = 500;
const BASE_DELAY = 500;

// used internally to extend passed config and set
// initial animated property value with uniform animation config
const extendConfig = (
  config: ComplexAnimationBuilder,
  axis: "x" | "y",
  value: number = 40
) =>
  config
    .easing(Easing.ease)
    .delay(BASE_DELAY)
    .withInitialValues({
      transform: [axis === "x" ? { translateX: value } : { translateY: value }],
    });

/**
 * Contains basic config for animation
 */
const ANIMATIONS = {
  BASE_DURATION: BASE_DURATION,
  BASE_DELAY: BASE_DELAY,
  /**
   * Simple slide-in animation config to be used for
   * all entrance animations for unified UX
   */
  Entrance: {
    fromLeft: extendConfig(FadeInLeft.duration(BASE_DURATION), "x", -40),
    fromRight: extendConfig(FadeInRight.duration(BASE_DURATION), "x", 40),
    fromUp: extendConfig(FadeInUp.duration(BASE_DURATION), "y", -40),
    fromDown: extendConfig(FadeInDown.duration(BASE_DURATION), "y", 40),
  },
};

export default ANIMATIONS;
