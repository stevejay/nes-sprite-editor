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

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;
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
    const columnLoopIndex = index % PIXEL_COLUMNS_PER_TILE;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;

    ctx.fillRect(
      columnIndex * scaling * PIXEL_COLUMNS_PER_TILE +
        columnLoopIndex * scaling,
      rowIndex * scaling * PIXEL_ROWS_PER_TILE + rowLoopIndex * scaling,
      scaling,
      scaling
    );
  });
}
