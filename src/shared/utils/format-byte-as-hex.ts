import { padStart } from "lodash";

export default function formatByteAsHex(integer: number) {
  return padStart(integer.toString(16), 2, "0").toUpperCase();
}
