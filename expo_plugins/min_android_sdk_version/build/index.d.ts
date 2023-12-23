import { ConfigPlugin } from "expo/config-plugins";
/**
 * Android plugin for changing `minSdkVersion` in project `build.gradle`.
 */
declare const withCustomMinSdkVersion: ConfigPlugin<number>;
export default withCustomMinSdkVersion;
