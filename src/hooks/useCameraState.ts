import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import useAppIsFocused from "~hooks/useAppIsFocused";
type ReturnType = [
  screenFocused: boolean,
  cameraPaused: boolean,
  setCameraPaused: React.Dispatch<React.SetStateAction<boolean>>
];

/**
 *  Abstracted to be re-usable for screens with `<Camera/>` component.
 *  Determines the final active state of the camera based on
 * `app focus`, `screen focus`, and custom, updatable `pause` state.
 *
 * Returns an array of three items:
 *
 * `screenFocused`: Use this to coditionally mount the `<Camera/>` component\
 * `cameraPaused`: Toggle this with the third setter function to pause camera without unmounting it
 * `setCameraPaused`: Call this with true when you want to freeze the camera (e.g when photo is taken)
 */
const useCameraState = (): ReturnType => {
  const [cameraPaused, setCameraPaused] = useState(false);
  const screenIsFocused = useIsFocused();
  const appIsFocused = useAppIsFocused();
  const screenFocused = screenIsFocused && appIsFocused;

  return [screenFocused, cameraPaused, setCameraPaused];
};

export default useCameraState;
