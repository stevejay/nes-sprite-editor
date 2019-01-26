import React from "react";
import { Color, Tile } from "../../types";
import { GamePaletteWithColors } from "../../reducer";

export default function useDrawTilesEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  tiles: Array<Tile>,
  backgroundColor: Color,
  palettes: Array<GamePaletteWithColors>,
  columns: number,
  scaling: number
) {
  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      tiles.forEach((tile, index) => {
        const colors = [
          backgroundColor,
          ...palettes[tile.gamePaletteId].colors
        ];
        drawTile(
          ctx,
          Math.floor(index / columns),
          index % columns,
          tile.pixels,
          colors,
          scaling
        );
      });
    },
    [tiles, backgroundColor, palettes, scaling]
  );
}

const PIXELS_PER_ROW = 8;
const PIXELS_PER_COLUMN = PIXELS_PER_ROW;
const UNAVAILABLE_COLOR = "#000";

function drawTile(
  ctx: CanvasRenderingContext2D,
  rowIndex: number,
  columnIndex: number,
  pixels: Uint8Array,
  colors: Array<Color>,
  scaling: number
) {
  let rowLoopIndex = -1;
  pixels.forEach((colorIndex, index) => {
    const columnLoopIndex = index % PIXELS_PER_COLUMN;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;

    ctx.fillRect(
      columnIndex * scaling * PIXELS_PER_COLUMN + columnLoopIndex * scaling,
      rowIndex * scaling * PIXELS_PER_ROW + rowLoopIndex * scaling,
      scaling,
      scaling
    );
  });
}
