import React from "react";
import useSizedCanvasEffect from "../../../shared/utils/use-sized-canvas-effect";
import { GamePaletteWithColors, PatternTile } from "../../../model";
import styles from "./PatternTableCanvas.module.scss";
import drawTile from "../draw-tile";
import { TILE_SIZE_PIXELS } from "../constants";

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scale: number; // in range [1, ...]
  tiles: Array<PatternTile>;
  palette: GamePaletteWithColors;
  ariaLabel: string;
};

const PatternTableCanvas = ({
  tilesInRow,
  tilesInColumn,
  scale,
  tiles,
  palette,
  ariaLabel
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    tilesInColumn * TILE_SIZE_PIXELS,
    tilesInRow * TILE_SIZE_PIXELS,
    scale
  );

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    tiles.forEach((tile, index) => {
      drawTile(
        ctx,
        Math.floor(index / tilesInColumn),
        index % tilesInColumn,
        0,
        0,
        tile.pixels,
        palette.colors,
        scale
      );
    });
  }, [tiles, palette, scale]);

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

export default PatternTableCanvas;
