// DON'T change this file's import and export type to es6

const { scale, verticalScale } = require("react-native-size-matters");
const AppThemeColors = require("./src/constants/theme");

// we want to be able to use scaled units in tailwind styles,
// so w-10 in tailwind style should return {width:scale(10)}
// for react native. below we generate 1-1000 tailwind spacing units
// which we'll loop over and generate their scaled equivalents for width and height
const SPACE_UNITS = Array(1000).fill(1);

// App Theme Configuration
const config = {
  content: [
    "./src/screens/**/*.{tsx,js,jsx,ts}",
    "./src/components/**/*.{tsx,js,jsx,ts}",
  ],
  theme: {
    screens: {
      sm: "380px",
      md: "620px",
      lg: "720px",
    },
    // Here we override default tailwind font sizes
    // because we have a custom Text component that
    // will auto scale supplied font sizes
    fontSize: false,
    spacing: SPACE_UNITS,
    fontFamily: {
      muli: "Muli",
    },
    extend: {
      colors: { ...AppThemeColors.default, transparent: "transparent" },
      // we apply the same logic as in spacing units,
      // but we scale respective to device height instead
      // of width as in spacing
      height: Object.fromEntries(
        SPACE_UNITS.map((_, idx) => [idx + 1, verticalScale(idx + 1)])
      ),
      width: Object.fromEntries(
        SPACE_UNITS.map((_, idx) => [idx + 1, scale(idx + 1)])
      ),
    },
  },
  plugins: [],
};

module.exports = config;
