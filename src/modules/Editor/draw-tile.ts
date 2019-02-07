import { Color } from "../../types";

const PIXEL_COLUMNS_PER_TILE = 8;
const UNAVAILABLE_COLOR = "#000";

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
    const columnLoopIndex = index % PIXEL_COLUMNS_PER_TILE;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;

    ctx.fillRect(
      column * scale * PIXEL_COLUMNS_PER_TILE +
        columnLoopIndex * scale +
        xOffset,
      row * scale * PIXEL_COLUMNS_PER_TILE + rowLoopIndex * scale + yOffset,
      scale,
      scale
    );
  });
}
