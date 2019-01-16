import { padStart } from "lodash";

export default function formatHex(decimalNum: number) {
  return padStart(decimalNum.toString(16), 2, "0").toUpperCase();
}
