import React from "react";
import useSizedCanvasEffect from "../../../shared/utils/use-sized-canvas-effect";
import {
  PATTERN_TABLE_COLUMNS,
  PATTERN_TABLE_ROWS,
  TILE_SIZE_PIXELS
} from "../constants";
import drawTile from "../draw-tile";
import { GamePaletteWithColors, PatternTile } from "../store";
import styles from "./PatternTableCanvas.module.scss";

type Props = {
  scale: number; // in range [1, ...]
  tiles: Array<PatternTile>;
  palette: GamePaletteWithColors;
};

const PatternTableCanvas = ({ scale, tiles, palette }: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  useSizedCanvasEffect(
    canvasRef,
    PATTERN_TABLE_COLUMNS * TILE_SIZE_PIXELS,
    PATTERN_TABLE_ROWS * TILE_SIZE_PIXELS,
    scale
  );

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    tiles.forEach((tile, index) => {
      drawTile(
        ctx,
        index >> 4, // Math.floor(index / PATTERN_TABLE_COLUMNS),
        index % PATTERN_TABLE_COLUMNS,
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
      aria-label="Pattern table tiles"
      ref={canvasRef}
      className={styles.canvas}
      role="img"
    />
  );
};

export default React.memo(PatternTableCanvas);
