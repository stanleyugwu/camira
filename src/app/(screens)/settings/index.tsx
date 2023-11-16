import Screen from "~components/Screen";
import SettingButton from "./components/SettingButton";
import tw from "~utils/tailwind";
import CategoryText from "./components/CategoryText";
import ANIMATIONS from "~constants/animation";
import { useRef, useState } from "react";
import BottomSheet from "~components/BottomSheet";
import Text from "~components/Text";
import { BottomSheetMethods } from "@devvie/bottom-sheet";
import SelectibleItems from "./components/SelectibleItems";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "~components/button/index";
import { StartUpScreens } from "~constants/startup_screen";
import useStore from "~hooks/global_state";
import ThemeColors from "~constants/theme";

enum Confirmation {
  Yes = "Yes",
  No = "No",
}

const BASE_DELAY = ANIMATIONS.BASE_DELAY - 100;

const STARTUP_SCREEN_NAMES = Object.values(StartUpScreens);
const ASK_FOR_CONFIRMATION = Object.values(Confirmation);

export default function Settings() {
  const startupSheetRef = useRef<BottomSheetMethods>();
  const codeConfirmSheetRef = useRef<BottomSheetMethods>();
  const changePrefixCodeSheetRef = useRef<BottomSheetMethods>();
  const [{ settings }, dispatch] = useStore();
  const [codePrefix, setCodePrefix] = useState(settings.rechargePrefixCode);
  const [savingcodePrefix, setSavingcodePrefix] = useState(false);

  // convenience util for opening bottom sheets
  const openSheet = (ref: React.MutableRefObject<BottomSheetMethods>) => {
    return () => ref.current?.open();
  };

  const handleSaveCodePrefix = () => {
    setSavingcodePrefix(true);
    dispatch({ type: "SET_RECHARGE_PREFIX_CODE", payload: codePrefix });
    setSavingcodePrefix(false);
  };

  return (
    <>
      <Screen>
        {/* General settings pane */}
        <CategoryText category="GENERAL" style={tw`mt-0`} />
        <SettingButton
          animationDelay={BASE_DELAY}
          onPress={openSheet(startupSheetRef)}
          iconName="ios-phone-portrait"
          rightLabel={settings.startUpScreen}
          label="Start-up screen"
        />

        {/* Top up settings pane */}
        <CategoryText category="TOP UP" />
        <SettingButton
          onPress={openSheet(codeConfirmSheetRef)}
          animationDelay={BASE_DELAY * 1.2}
          iconName="ios-checkmark-done-circle"
          rightLabel={
            settings.askForCodeConfirmation ? Confirmation.Yes : Confirmation.No
          }
          label="Ask For Code Confirmation"
        />
        <SettingButton
          onPress={openSheet(changePrefixCodeSheetRef)}
          animationDelay={BASE_DELAY * 1.4}
          iconName="ios-call-sharp"
          rightLabel={settings.rechargePrefixCode}
          label="Change Recharge Code"
          style={tw`mt-2`}
        />
      </Screen>

      {/* Sheet for startup screen setting */}
      <BottomSheet height={"60%"} ref={startupSheetRef} title="START-UP SCREEN">
        <View style={tw`p-2 bg-primary rounded-md`}>
          <Text color="lightGray" type="label" style={tw`text-center`}>
            Choose the section of the app you want to see first when you open
            it. The app will directly open to your chosen part.
          </Text>
        </View>
        <SelectibleItems
          style={tw`mt-6`}
          items={STARTUP_SCREEN_NAMES}
          activeItem={settings.startUpScreen}
          onSelect={(selected: StartUpScreens) => {
            dispatch({ type: "SET_STARTUP_SCREEN", payload: selected });
            startupSheetRef.current?.close();
          }}
        />
      </BottomSheet>

      {/* Sheet for code confirmation */}
      <BottomSheet
        height={"50%"}
        ref={codeConfirmSheetRef}
        title="ASK FOR PIN CONFIRMATION"
      >
        <View style={tw`p-2 bg-primary rounded-md`}>
          <Text color="lightGray" type="label" style={tw`text-center`}>
            When 'Yes', you will be shown any detected recharge voucher pin
            before dialing it, for confirmation
          </Text>
        </View>
        <SelectibleItems
          style={tw`mt-6`}
          items={ASK_FOR_CONFIRMATION}
          activeItem={
            settings.askForCodeConfirmation ? Confirmation.Yes : Confirmation.No
          }
          onSelect={(selected) => {
            dispatch({
              type: "SET_ASK_CODE_CONFIRMATION",
              payload: selected === Confirmation.Yes ? true : false,
            });
            codeConfirmSheetRef.current?.close();
          }}
        />
      </BottomSheet>

      {/* Sheet for changing rechage code */}
      <BottomSheet
        height={"50%"}
        ref={changePrefixCodeSheetRef}
        title="CHANGE RECHARGE PREFIX CODE"
      >
        <View style={tw`p-2 bg-primary rounded-md`}>
          <Text color="lightGray" type="label" style={tw`text-center`}>
            Set a custom recharge code e.g '*123*' that will be used for your
            airtime top-ups instead of the default code.
          </Text>
        </View>
        <Text type="label" color="lightGray" style={tw`mt-8`}>
          Will Translate to: {codePrefix}RECHARGE_PIN#
        </Text>
        <TextInput
          value={codePrefix}
          onChangeText={(text) => setCodePrefix(text)}
          cursorColor={ThemeColors.accent}
          dataDetectorTypes={"none"}
          enablesReturnKeyAutomatically
          enterKeyHint="done"
          inputMode="tel"
          maxLength={10}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          placeholderTextColor={"#aab"}
          style={[
            tw`text-gray p-5 border border-[#bbb] rounded-md w-full mt-3`,
          ]}
          placeholder="Enter new code (e.g *123*)"
        />
        <Button
          disabled={!codePrefix}
          loading={savingcodePrefix}
          loadingText="Saving"
          style={tw`mt-4`}
          label="Save"
          onPress={handleSaveCodePrefix}
          type="big"
        />
      </BottomSheet>
    </>
  );
}
