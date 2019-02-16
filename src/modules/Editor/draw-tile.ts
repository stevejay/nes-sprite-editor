import { Color } from "./store";
import { TILE_SIZE_PIXELS, UNAVAILABLE_COLOR } from "./constants";
import { isNumber } from "lodash";

export default function drawTile(
  ctx: CanvasRenderingContext2D,
  row: number,
  column: number,
  xTileOffset: number,
  yTileOffset: number,
  pixels: Uint8Array | number,
  colors: Array<Color>,
  scale: number
) {
  const x = column * scale * TILE_SIZE_PIXELS + xTileOffset * scale;
  const y = row * scale * TILE_SIZE_PIXELS + yTileOffset * scale;

  if (isNumber(pixels)) {
    // Optimization for a tile that is a solid color:
    ctx.fillStyle = getFillStyle(colors, pixels);
    ctx.fillRect(x, y, scale * TILE_SIZE_PIXELS, scale * TILE_SIZE_PIXELS);
  } else {
    // A tile that is not a solid color; draw 64 pixels:
    let rowLoopIndex = -1;
    pixels.forEach((colorIndex, index) => {
      const columnLoopIndex = index & (TILE_SIZE_PIXELS - 1);
      if (columnLoopIndex === 0) {
        ++rowLoopIndex;
      }
      ctx.fillStyle = getFillStyle(colors, colorIndex);
      ctx.fillRect(
        x + columnLoopIndex * scale,
        y + rowLoopIndex * scale,
        scale,
        scale
      );
    });
  }
}

function getFillStyle(colors: Array<Color>, colorIndex: number) {
  const color = colors[colorIndex];
  return color.available ? color.rgb : UNAVAILABLE_COLOR;
}
