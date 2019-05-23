import React from "react";
import { GamePaletteWithColors, Nametable, PatternTile } from "../../store";
import drawTile from "../../draw-tile";
import { createTileIndexBounds, RenderCanvasPositioning } from "./experiment";

const TOTAL_NAMETABLE_X_TILES = 32;

export default function useDrawNametableEffect(
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
  }, [nametable, patternTiles, palettes, renderCanvasPositioning, canvasRef]);
}
