import React from "react";
import styles from "./NametableCanvas.module.scss";
import {
  PatternTile,
  GamePaletteWithColors,
  Nametable,
  Color
} from "../../types";
import {
  ViewportSize,
  RenderCanvasPositioning,
  createTileIndexBounds
} from "./experiment";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";
import usePositionedCanvasEffect from "../../shared/utils/use-positioned-canvas-effect";

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

    // console.log("renderCanvasPositioning", renderCanvasPositioning);

    // TODO find a better way to draw a 'rectangle' from the tileIndexes array.

    const tileIndexBounds = createTileIndexBounds(renderCanvasPositioning);

    // console.log("renderCanvasPositioning", renderCanvasPositioning);
    // console.log("tileIndexBounds", tileIndexBounds);

    for (
      let yTileIndex = tileIndexBounds.yTileIndex;
      yTileIndex < tileIndexBounds.yTileIndex + tileIndexBounds.heightInTiles;
      ++yTileIndex
    ) {
      for (
        let xTileIndex = tileIndexBounds.xTileIndex;
        xTileIndex < tileIndexBounds.xTileIndex + tileIndexBounds.widthInTiles;
        ++xTileIndex
      ) {
        const tileIndex =
          nametable.tileIndexes[
            xTileIndex + yTileIndex * TOTAL_NAMETABLE_X_TILES
          ];

        const renderXTileIndex = xTileIndex - tileIndexBounds.xTileIndex;
        const renderYTileIndex = yTileIndex - tileIndexBounds.yTileIndex;

        const yMetatileIndex = Math.floor(yTileIndex * 0.5);
        const xMetatileIndex = Math.floor(xTileIndex * 0.5);

        const paletteIndex =
          nametable.paletteIndexes[
            yMetatileIndex * (TOTAL_NAMETABLE_X_TILES * 0.5) + xMetatileIndex
          ];

        // console.log(
        //   `tile:${tileIndex} ${xTileIndex}/${yTileIndex} => ${renderXTileIndex}/${renderYTileIndex} ${paletteIndex}`
        // );

        drawTile(
          ctx,
          renderYTileIndex,
          renderXTileIndex,
          tileIndexBounds.xTileOffset,
          tileIndexBounds.yTileOffset,
          patternTiles[tileIndex].pixels, // pixels
          palettes[paletteIndex].colors, // palettes
          renderCanvasPositioning.scale,
          // debug:
          xTileIndex,
          yTileIndex
        );
      }
    }
  }, [nametable, patternTiles, palettes, renderCanvasPositioning]);
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  row: number,
  column: number,
  xTileOffset: number,
  yTileOffset: number,
  pixels: Uint8Array,
  colors: Array<Color>,
  scaling: number,
  // debug:
  xTileIndex: number,
  yTileIndex: number
) {
  let rowLoopIndex = -1;

  const xOffset = xTileOffset * scaling;
  const yOffset = yTileOffset * scaling;

  pixels.forEach((colorIndex, index) => {
    const columnLoopIndex = index % TILE_SIZE_PIXELS;
    if (columnLoopIndex === 0) {
      ++rowLoopIndex;
    }

    const color = colors[colorIndex];
    const rgbString = color.available ? color.rgb : UNAVAILABLE_COLOR;
    ctx.fillStyle = rgbString;

    ctx.fillRect(
      column * scaling * TILE_SIZE_PIXELS + columnLoopIndex * scaling + xOffset,
      row * scaling * TILE_SIZE_PIXELS + rowLoopIndex * scaling + yOffset,
      scaling,
      scaling
    );
  });

  // ctx.font = "10px Arial";
  // ctx.fillStyle = "white";
  // ctx.fillText(
  //   `${xTileIndex}/${yTileIndex}`,
  //   column * scaling * TILE_SIZE_PIXELS + 1 + xOffset,
  //   row * scaling * TILE_SIZE_PIXELS + 10 + yOffset
  // );
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

  useSizedCanvasEffect(
    canvasRef,
    renderCanvasPositioning.size.widthLogicalPx,
    renderCanvasPositioning.size.heightLogicalPx,
    renderCanvasPositioning.scale
  );

  usePositionedCanvasEffect(
    canvasRef,
    renderCanvasPositioning.viewportOffset.xLogicalPx,
    renderCanvasPositioning.viewportOffset.yLogicalPx,
    renderCanvasPositioning.scale
  );

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
