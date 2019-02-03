import React from "react";
import styles from "./NametableCanvas.module.scss";
import {
  PatternTile,
  GamePaletteWithColors,
  Nametable,
  Color
} from "../../types";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";
import classNames from "classnames";
import { CanvasViewport, PixelScaling } from "./Nametable";

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
  style?: any; // TODO fix any
  onMouseDown?: any; // TODO fix any
  onMouseUp?: any; // TODO fix any
  onTouchStart?: any; // TODO fix any
  onTouchEnd?: any; // TODO fix any
  pixelScaling: PixelScaling;
  canvasViewport: CanvasViewport;
  nametable: Nametable;
  patternTiles: Array<PatternTile>;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
};

const NametableCanvas = ({
  style,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  pixelScaling,
  canvasViewport,
  nametable,
  patternTiles,
  palettes,
  ariaLabel
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    canvasViewport.scaling === 1 ? 30 : 32,
    32,
    pixelScaling * PIXEL_ROWS_PER_TILE,
    pixelScaling * PIXEL_COLUMNS_PER_TILE
  );

  useDrawNametableEffect(
    canvasRef,
    nametable,
    patternTiles,
    palettes,
    32,
    pixelScaling * canvasViewport.scaling
  );

  return (
    // <div
    //   className={styles.viewport}
    //   style={{
    //     width: pixelScaling * 8 * 32, // 256, 512, ...
    //     height: pixelScaling * 8 * 32
    //   }}
    // >
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{ ...style, ...canvasSize }}
      role="img"
      aria-label={ariaLabel}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
    // </div>
  );
};

export default NametableCanvas;
