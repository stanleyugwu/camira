import { Text, TouchableOpacity, View } from "react-native";
import tw from "~utils/tailwind";
import getCarrierColor from "../utils/getCarrierColor";
import styles from "../utils/styles";

export type SelectedSimInfo = {
  carrierName: string;
  simSlotIdx: number;
};

interface SelectedSimProps {
  /** info of the selected sim */
  info: SelectedSimInfo;
  /** Called when sim is pressed */
  onPress: () => void;
}

/** Shows the currently selected sim */
const SelectedSim = ({ onPress, info }: SelectedSimProps) => {
  const simColor = getCarrierColor(info.carrierName);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={tw`border border-secondary h-40 w-37 rounded-tr-xl py-1 px-0.5`}
      >
        <View
          style={tw.style(`w-8 h-4 mb-1`, { backgroundColor: simColor[0][0] })}
        />
        <Text
          lineBreakMode="middle"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[styles.simName]}
        >
          {info.carrierName}
        </Text>
        <Text style={styles.simNumber}>SIM {info.simSlotIdx + 1}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SelectedSim;
