/**
 * Maps routable screen names to displayable and storable
 * text for startup-screen setting
 *
 * The keys are valid screen names that can be routed to, and used in the navigator,
 * while the values are texts that can be shown to user, and stored as setting
 */
export enum StartUpScreens {
  "home" = "Home",
  "top_up" = "Airtime Top-Up",
  "scan_document" = "Scan Document",
  "scan_qrcode" = "Scan QR Code or Image",
  "generate_qrCode" = "Generate QR Code or Image",
}
