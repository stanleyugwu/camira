type ColorPair = [
  // gradient background color
  [string, string],
  // text color
  string
];

// mapping btw carrier name and colors (background and text)
const colors: Record<string, ColorPair> = {
  mtn: [["#ffb100", "#f3f307"], "#000000"],
  glo: [["#25ab07", "#64ea46"], "#ffffff"],
  "9mobile": [["#052103", "#17cf09"], "#ffffff"],
  etisalat: [["#052103", "#17cf09"], "#ffffff"],
  airtel: [["#c41406", "#e3483c"], "#ffffff"],
  zain: [["#c41406", "#e3483c"], "#ffffff"],
};

/**
 * Gets the brand color of given carrier
 */
const getCarrierColor = (carrierName: string): ColorPair => {
  for (let name in colors)
    if (carrierName.toLowerCase().includes(name)) return colors[name];
  return [["#78023b", "#bd0e63"], "#ffffff"];
};

export default getCarrierColor;
