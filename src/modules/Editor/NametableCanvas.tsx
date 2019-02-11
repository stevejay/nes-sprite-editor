import React from "react";
import usePositionedCanvasEffect from "../../shared/utils/use-positioned-canvas-effect";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";
import {
  GamePaletteWithColors,
  Nametable,
  PatternTile
} from "../../model";
import drawTile from "./draw-tile";
import {
  createTileIndexBounds,
  RenderCanvasPositioning,
  ViewportSize
} from "./experiment";
import styles from "./NametableCanvas.module.scss";

const TOTAL_NAMETABLE_X_TILES = 32;

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

    // TODO find a better way to draw a 'rectangle' from the tileIndexes array.

    const tileIndexBounds = createTileIndexBounds(renderCanvasPositioning);

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

        drawTile(
          ctx,
          renderYTileIndex,
          renderXTileIndex,
          tileIndexBounds.xTileOffset,
          tileIndexBounds.yTileOffset,
          patternTiles[tileIndex].pixels,
          palettes[paletteIndex].colors,
          renderCanvasPositioning.scale
        );
      }
    }
  }, [nametable, patternTiles, palettes, renderCanvasPositioning]);
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
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void; // TODO fix any
  onMouseUp?: any; // TODO fix any
  onTouchStart?: any; // TODO fix any
  onTouchEnd?: any; // TODO fix any
};

const NametableCanvas = ({
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
