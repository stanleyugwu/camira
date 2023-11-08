import {
  ComplexAnimationBuilder,
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

// used internally to extend passed config and set
// initial animated property value with uniform animation config
const extendConfig = (
  config: ComplexAnimationBuilder,
  axis: "x" | "y",
  value: number = 40
) =>
  config
    .easing(Easing.ease)
    .delay(500)
    .withInitialValues({
      transform: [axis === "x" ? { translateX: value } : { translateY: value }],
    });

/**
 * Simple slide-in animation config to be used for
 * all entrance animations for unified UX
 */
const EntranceAnimation = {
  fromLeft: extendConfig(FadeInLeft.duration(500), "x", -40),
  fromRight: extendConfig(FadeInRight.duration(500), "x", 40),
  fromUp: extendConfig(FadeInUp.duration(500), "y", -40),
  fromDown: extendConfig(FadeInDown.duration(500), "y", 40),
};

export default EntranceAnimation;
