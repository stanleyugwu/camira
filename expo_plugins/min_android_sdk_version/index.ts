import { ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

/**
 * Android plugin for changing `minSdkVersion` in project `build.gradle`.
 */
const withCustomMinSdkVersion: ConfigPlugin<number> = (config, sdkVersion) => {
  return withProjectBuildGradle(config, async (config) => {
    const content = config.modResults.contents;
    const searchValue = /minSdkVersion ?= ?.*\n/g;
    config.modResults.contents = content.replace(
      searchValue,
      `minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '${sdkVersion}')\n`
    );
    return config;
  });
};

export default withCustomMinSdkVersion;
