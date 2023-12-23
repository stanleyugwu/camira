import { TouchableOpacity, View } from "react-native";
import tw from "~utils/tailwind";
import { SelectedSimInfo } from "./SelectedSim";
import { Text } from "react-native";
import getCarrierColor from "../utils/getCarrierColor";
import styles from "../utils/styles";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";
import { scale } from "react-native-size-matters";

interface SimProps {
  /** Sim info */
  info: SelectedSimInfo;
  /** Determines whether the sim the currently selected top-up sim */
  isSelected: boolean;
  /** Called when sim is slected */
  onSelect: () => void;
}

/**
 * Represents a selectible sim in the sim modal dialog
 */
const Sim = ({ info, isSelected, onSelect }: SimProps) => {
  const color = getCarrierColor(info.carrierName);
  const width = scale(40),
    height = scale(50);
  const path = `M0,0 L${width - 10},0 L${width},10 v${height} h-${width} v0`;
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={tw`mx-1 box-shadow`}
    >
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id="gradient" x2={"1"} y2={"1"}>
            <Stop offset={"0.5"} stopColor={color[0][0]} />
            <Stop offset={"1"} stopColor={color[0][1]} />
          </LinearGradient>
        </Defs>
        <Path d={path} fill={"url(#gradient)"} />
        <View style={tw`p-1`}>
          <View
            style={tw`w-9 h-9 mb-2 bg-secondary rounded-full items-center justify-center`}
          >
            {isSelected && <View style={tw`w-6 h-6 bg-gray rounded-full`} />}
          </View>
          <Text
            lineBreakMode="middle"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.simName, { color: color[1] }]}
          >
            {info.carrierName}
          </Text>
          <Text style={[styles.simNumber, { color: color[1] }]}>
            SIM {info.simSlotIdx + 1}
          </Text>
        </View>
      </Svg>
    </TouchableOpacity>
  );
};
export default Sim;
