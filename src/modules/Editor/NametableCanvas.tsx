import React from "react";
import styles from "./PatternTableCanvas.module.scss";
import {
  PatternTile,
  GamePaletteWithColors,
  Nametable,
  Color
} from "../../types";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;
const UNAVAILABLE_COLOR = "#000";

function useDrawNametableEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  nametable: Nametable,
  patternTiles: Array<PatternTile>,
  palettes: Array<GamePaletteWithColors>,
  columns: number,
  scaling: number
) {
  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    nametable.tileIndexes.forEach((tileIndex, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;

      const metatileRow = Math.floor(row / 2);
      const metatileColumn = Math.floor(column / 2);

      const paletteIndex =
        nametable.paletteIndexes[metatileRow * (columns / 2) + metatileColumn];

      drawTile(
        ctx,
        row,
        column,
        patternTiles[tileIndex].pixels, // pixels
        palettes[paletteIndex].colors, // palettes
        scaling
      );
    });
  }, [nametable, patternTiles, palettes, scaling]);
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  row: number,
  column: number,
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
      column * scaling * PIXEL_COLUMNS_PER_TILE + columnLoopIndex * scaling,
      row * scaling * PIXEL_ROWS_PER_TILE + rowLoopIndex * scaling,
      scaling,
      scaling
    );
  });
}

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scaling: number; // in range [1, ...]
  nametable: Nametable;
  patternTiles: Array<PatternTile>;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
};

const NametableCanvas = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  nametable,
  patternTiles,
  palettes,
  ariaLabel
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    tilesInRow,
    tilesInColumn,
    scaling * PIXEL_ROWS_PER_TILE,
    scaling * PIXEL_COLUMNS_PER_TILE
  );

  useDrawNametableEffect(
    canvasRef,
    nametable,
    patternTiles,
    palettes,
    tilesInColumn,
    scaling
  );

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={canvasSize}
      role="img"
      aria-label={ariaLabel}
    />
  );
};

export default NametableCanvas;
