declare module "*.avif" {
  const src: number;
  export default src;
}

declare module "*.bmp" {
  const src: number;
  export default src;
}

declare module "*.gif" {
  const src: number;
  export default src;
}

declare module "*.jpg" {
  const src: number;
  export default src;
}

declare module "*.jpeg" {
  const src: number;
  export default src;
}

declare module "*.png" {
  const src: number;
  export default src;
}

declare module "*.webp" {
  const src: number;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string; onPress?: () => void }
  >;

  export const src: string;
  export default ReactComponent;
}

// TODO: laugh at this over-killed, verbose and accurate typing
/**
 * These are the typings for a valid recharge card pin
 */

// using this will break typescript, the result will be too complex
// type PinDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type PinDigit = number;
type Sep = "-" | " " | " -" | "- "; // pin seperator
type PinDigit_4 = `${PinDigit}${PinDigit}${PinDigit}${PinDigit}`; // e.g 1234
type PinDigit_5 = `${PinDigit}${PinDigit}${PinDigit}${PinDigit}${PinDigit}`; // e.g 12345

type PinNum = PinDigit_4 | PinDigit_5; // 1234 or 12345
type Two = `${PinNum}${Sep}${PinNum}`; // e.g 1234 - 12345
type Three = `${Two}${Sep}${PinNum}`; // e.g 1234 - 12345 - 1234
type Four = `${Three}${Sep}${PinNum}`; // e.g 1234 - 12345 - 11111- 11111

type RechargePin = Four | Three | Two;

