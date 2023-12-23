import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import tw from "~utils/tailwind";
import Icon from "@expo/vector-icons/Ionicons";
import ThemeColors from "~constants/theme";
import { scale } from "react-native-size-matters";
import { AnimatePresence, MotiView } from "moti";
import SelectedSim, { SelectedSimInfo } from "./components/SelectedSim";
import Caret from "./components/Caret";
import { getSimInfo as getSimsInfo } from "rn-direct-phone-call";
import Sim from "./components/Sim";
import { ScrollView } from "react-native-gesture-handler";

// FIXME: fix sim selector modal height cutout
type SimInfo = {
  carrierName0: string;
  displayName0: string;
  simSlotIndex0: number;
  carrierName1?: string;
  displayName1?: string;
  simSlotIndex1?: number;
};

interface SimSelectorProps {
  /**
   * Called with a sim number, when user changes top-up sim.
   * sim numbers begin from 0 where 0 is SIM 1
   */
  onSelect: (simNumber: number) => void;
}

/**
 * Handles showing and allowing user select sim card for current
 * top-up on a dual sim device
 */
const SimSelector = ({ onSelect }: SimSelectorProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [simsInfo, setSimsInfo] = useState<SimInfo>();
  const [selectedSimIdx, setSelectedSimIdx] = useState(0);
  const noOfSims = useRef<number>();

  // calculates how many sims the device has and
  // gets the sims info
  useEffect(() => {
    const simsInfo = getSimsInfo();
    const keys = simsInfo instanceof Object && Object.keys(simsInfo);
    if (keys && keys.length > 2) {
      noOfSims.current = Math.ceil(keys.length / 3);
      setSimsInfo(simsInfo);
    }
  }, []);

  if (!simsInfo) return null; // no sim detected

  const getSimInfo = (simSlotIndex: number): SelectedSimInfo => ({
    carrierName: simsInfo[`carrierName${simSlotIndex}`] || "UNKNOWN",
    simSlotIdx: simSlotIndex,
  });

  const selectedSimInfo = getSimInfo(selectedSimIdx);

  return (
    <View style={tw`flex-row items-center justify-center h-60`}>
      <SelectedSim
        info={selectedSimInfo}
        onPress={() => {
          if (noOfSims.current > 1) {
            setModalOpen(!modalOpen);
          }
        }}
      />
      {!modalOpen && noOfSims.current > 1 && <Caret />}

      <AnimatePresence exitBeforeEnter>
        {modalOpen && (
          <MotiView
            id="modal"
            from={{ translateX: -20, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            exit={{ translateX: -20, opacity: 0 }}
            style={tw`ml-2 w-120 flex-row items-center justify-center`}
          >
            <Icon
              name="ios-caret-back-outline"
              color={ThemeColors.primary}
              size={scale(20)}
              style={tw`self-center`}
            />
            <ScrollView
              horizontal
              style={tw`rounded-md bg-secondary`}
              contentContainerStyle={tw`rounded-md items-center h-60 justify-evenly`}
            >
              {Array(noOfSims.current)
                .fill("")
                .map((_, simIdx) => {
                  const simInfo = getSimInfo(simIdx);
                  return (
                    <Sim
                      onSelect={() => {
                        setModalOpen(false);
                        setSelectedSimIdx(simIdx);
                        onSelect(simIdx);
                      }}
                      isSelected={simIdx === selectedSimIdx}
                      key={`sim-${simIdx}`}
                      info={simInfo}
                    />
                  );
                })}
            </ScrollView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default SimSelector;
