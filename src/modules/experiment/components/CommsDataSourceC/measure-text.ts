// ideas for improving this:
// https://github.com/kapetan/text-width/blob/master/index.js

const canvas = document.createElement("canvas");

export default function measureText(
  text: string,
  fontFamily: string,
  fontSize: number | string
): TextMetrics {
  const ctx = canvas.getContext("2d")!;
  const font = `normal normal normal ${
    typeof fontSize === "number" ? fontSize + "px" : fontSize
  } ${fontFamily}`;
  ctx.font = font;
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
  return ctx.measureText(text);
}
