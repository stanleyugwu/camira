module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      "react-native-worklets-core/plugin",
      "expo-router/babel",
      [
        "module-resolver",
        {
          alias: {
            "~components/*": ["./src/components/*"],
            "~assets/*": ["./src/assets/*"],
            "~images/*": ["./src/assets/images/*"],
            "~screens/*": ["./src/app/(screens)/*"],
            "~utils/*": ["./src/utils/*"],
            "~constants/*": ["./src/constants/*"],
            "~hooks/*": ["./src/hooks/*"],
            "~navigator/*": ["./src/navigator/*"],
            "~navigator": ["./src/navigator"],
            "~contexts/*": ["./src/contexts/*"],
            "~api/*": ["./src/api/*"],
            "~root/*": ["./*"],
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  };
};
