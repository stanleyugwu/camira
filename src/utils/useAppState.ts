import { useLayoutEffect, useState } from "react";
import { AppState } from "react-native";

/**
 * Monitors when app moves to background (blur) and foreground (focus)
 */
const useAppState = () => {
  const [isActive, setIsActive] = useState(true);
  useLayoutEffect(() => {
    AppState.addEventListener("change", (state) => {
      if (state === "active") setIsActive(true);
      else setIsActive(false);
    });
  }, []);

  return isActive;
};

export default useAppState;
