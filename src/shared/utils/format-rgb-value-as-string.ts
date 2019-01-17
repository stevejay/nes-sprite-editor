import { RGBValue } from "../../types";

export default function formatRgbValueAsString(values: RGBValue) {
  return `rgb(${values[0]},${values[1]},${values[2]})`;
}
