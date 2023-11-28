/*
 * Regular expression patterns for matching recharge card
 * pins of different formats and grouping
 */

// 4 or 5 digits: 0000 or 00000
const d = "\\d{4,5}";
// 5 digits: 12345
const d5 = "\\d{5,5}";
// the seperator: hyphen (with optional single space around it) or a single space
const s = "(\\s?-\\s?|\\s{2,2})";
// for two-grouped 5 digit pin e.g 00000-00000 (we don't support 4 digits for two-group)
const two = `${d5}${s}${d5}`;
// for three-grouped pin e.g 00000-00000-0000
const three = `${d}${s}${d}${s}${d}`;
// for four-grouped pin e.g 0000-0000-0000-00000
const four = `${three}${s}${d}`;
// main regex
const RECHARGE_PIN_REGEX = new RegExp(
  String.raw`(${four}|${three}|${two})`,
  "g"
);

export default RECHARGE_PIN_REGEX;
