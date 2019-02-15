import { Color } from "./store";
import { TILE_SIZE_PIXELS, UNAVAILABLE_COLOR } from "./constants";

export default function drawTile(
  ctx: CanvasRenderingContext2D,
  row: number,
  column: number,
  xTileOffset: number,
  yTileOffset: number,
  pixels: Uint8Array,
  colors: Array<Color>,
  scale: number
) {
  let rowLoopIndex = -1;

  const xOffset = xTileOffset * scale;
  const yOffset = yTileOffset * scale;

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
