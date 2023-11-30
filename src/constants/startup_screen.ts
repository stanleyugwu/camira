/**
 * Maps routable screen names to displayable and storable
 * text for startup-screen setting
 *
 * The keys are valid screen names that can be routed to, and used in the navigator,
 * while the values are texts that can be shown to user, stored in global state,
 * and stored as setting
 */
export enum StartUpScreens {
  "home" = "Home",
  "top_up" = "Airtime Top-Up",
  "scan_document" = "Scan Document",
  "scan_qrcode" = "Scan QR Code or Image",
  "generate_qrcode" = "Generate QR Code or Image",
}

/**
 * Due to no support string enum reverse mapping,
 * this function will get the key from the value
 */
export const getStartupScreenKeyFromValue = (
  value: StartUpScreens
): keyof typeof StartUpScreens =>
  Object.entries(StartUpScreens).filter(
    (item) => item[1] === value
  )[0][0] as keyof typeof StartUpScreens;
