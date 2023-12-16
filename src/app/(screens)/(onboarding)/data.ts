import { ImageRequireSource } from "react-native";

/**
 * Each Scene or Screen in the onboarding
 */
export type Scene = {
  featureImg: ImageRequireSource;
  title: string;
  paragraph: string;
  titleColor: string;
  id: string;
};

/**
 * Data/Content for the onboarding screens
 */
const ONBOARDING_SCENES: Scene[] = [
  {
    id: "1",
    featureImg: require("./images/top-up.png"),
    title: "Snap & Top-Up",
    titleColor: "#8886FF",
    paragraph:
      "No more typing digits. Point your camera to your voucher card and experience instant airtime top-ups!",
  },
  {
    id: "2",
    featureImg: require("./images/document.png"),
    title: "Paper to Pixels",
    titleColor: "#AC3DC6",
    paragraph:
      "Capture the future. Our document scanner transforms papers into digital brilliance. Scan, organize, and free your world from the tyranny of paperwork!",
  },
];

export default ONBOARDING_SCENES;
