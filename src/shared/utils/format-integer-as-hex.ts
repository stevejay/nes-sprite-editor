import { padStart } from "lodash";

export default function formatIntegerAsHex(integer: number) {
  return padStart(integer.toString(16), 2, "0").toUpperCase();
}
