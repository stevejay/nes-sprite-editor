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
  let rowLoopIndex = -1;

  const xOffset = xTileOffset * scale;
  const yOffset = yTileOffset * scale;

  if (isNumber(pixels)) {
    // Optimization for a tile that is a solid color:
    const color = colors[pixels];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;
    ctx.fillRect(
      column * scale * TILE_SIZE_PIXELS + xOffset,
      row * scale * TILE_SIZE_PIXELS + yOffset,
      scale * TILE_SIZE_PIXELS,
      scale * TILE_SIZE_PIXELS
    );
  } else {
    // A tile that is not a solid color; draw 64 pixels:
    pixels.forEach((colorIndex, index) => {
      const columnLoopIndex = index % TILE_SIZE_PIXELS;
      if (columnLoopIndex === 0) {
        ++rowLoopIndex;
      }

      const color = colors[colorIndex];
      const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
      ctx.fillStyle = rgbString;

      ctx.fillRect(
        column * scale * TILE_SIZE_PIXELS + columnLoopIndex * scale + xOffset,
        row * scale * TILE_SIZE_PIXELS + rowLoopIndex * scale + yOffset,
        scale,
        scale
      );
    });
  }
}
