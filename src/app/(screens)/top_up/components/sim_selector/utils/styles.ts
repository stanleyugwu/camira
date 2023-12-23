import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import tw from "~utils/tailwind";

const styles = StyleSheet.create({
  simName: tw.style(`text-secondary`, {
    fontSize: scale(8),
    fontWeight: "bold",
  }),
  simNumber: tw.style(`text-secondary`, {
    fontSize: scale(6),
    fontWeight: "700",
  }),
});

export default styles;
