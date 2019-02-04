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
import {
  ViewportSize,
  RenderCanvasPositioning,
  createTileIndexBounds
} from "./experiment";

const TILE_SIZE_PIXELS = 8;
const TOTAL_NAMETABLE_X_TILES = 32;
const TOTAL_NAMETABLE_Y_TILES = 30;
const UNAVAILABLE_COLOR = "#000";

function useDrawNametableEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  nametable: Nametable,
  patternTiles: Array<PatternTile>,
  palettes: Array<GamePaletteWithColors>,
  renderCanvasPositioning: RenderCanvasPositioning
) {
  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    console.log("renderCanvasPositioning", renderCanvasPositioning);

    // TODO find a better way to draw a 'rectangle' from the tileIndexes array.

    const tileIndexBounds = createTileIndexBounds(renderCanvasPositioning);

    nametable.tileIndexes.forEach((tileIndex, index) => {
      const row = Math.floor(index / TOTAL_NAMETABLE_X_TILES);
      const column = index % TOTAL_NAMETABLE_X_TILES;

      if (
        column < tileIndexBounds.x ||
        column >= tileIndexBounds.x + tileIndexBounds.width
      ) {
        return;
      }

      if (
        row < tileIndexBounds.y ||
        row >= tileIndexBounds.y + tileIndexBounds.height
      ) {
        return;
      }

      const metatileRow = Math.floor(row / 2);
      const metatileColumn = Math.floor(column / 2);

      const paletteIndex =
        nametable.paletteIndexes[
          metatileRow * (TOTAL_NAMETABLE_X_TILES / 2) + metatileColumn
        ];

      drawTile(
        ctx,
        row,
        column,
        tileIndexBounds.xOffset,
        tileIndexBounds.yOffset,
        patternTiles[tileIndex].pixels, // pixels
        palettes[paletteIndex].colors, // palettes
        renderCanvasPositioning.scale
      );
    });
  }, [nametable, patternTiles, palettes, renderCanvasPositioning]);
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  row: number,
  column: number,
  xOffset: number,
  yOffset: number,
  pixels: Uint8Array,
  colors: Array<Color>,
  scaling: number
) {
  let rowLoopIndex = -1;
  pixels.forEach((colorIndex, index) => {
    const columnLoopIndex = index % TILE_SIZE_PIXELS;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;

    ctx.fillRect(
      column * scaling * TILE_SIZE_PIXELS +
        (columnLoopIndex + xOffset) * scaling,
      row * scaling * TILE_SIZE_PIXELS + (rowLoopIndex + yOffset) * scaling,
      scaling,
      scaling
    );
  });
}

type Props = {
  viewportSize: ViewportSize;
  renderCanvasPositioning: RenderCanvasPositioning;
  nametable: Nametable;
  patternTiles: Array<PatternTile>;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
  // react-draggable:
  style?: any; // TODO fix any
  onMouseDown?: any; // TODO fix any
  onMouseUp?: any; // TODO fix any
  onTouchStart?: any; // TODO fix any
  onTouchEnd?: any; // TODO fix any
};

const NametableCanvas = ({
  viewportSize,
  renderCanvasPositioning,
  nametable,
  patternTiles,
  palettes,
  ariaLabel,
  // react-draggable:
  style,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // The new useSizedCanvasEffect hook:
  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;

    const width =
      renderCanvasPositioning.size.widthLogicalPx *
      renderCanvasPositioning.scale;

    const height =
      renderCanvasPositioning.size.heightLogicalPx *
      renderCanvasPositioning.scale;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.style.left =
      renderCanvasPositioning.viewportOffset.xLogicalPx *
        renderCanvasPositioning.scale +
      "px";

    canvas.style.top =
      renderCanvasPositioning.viewportOffset.yLogicalPx *
        renderCanvasPositioning.scale +
      "px";

    const scale = window.devicePixelRatio;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
  }, [renderCanvasPositioning]);

  useDrawNametableEffect(
    canvasRef,
    nametable,
    patternTiles,
    palettes,
    renderCanvasPositioning
  );

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={style}
      role="img"
      aria-label={ariaLabel}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );
};

export default NametableCanvas;
