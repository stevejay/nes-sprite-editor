import React from "react";
import styles from "./PatternTableCanvas.module.scss";
import { PatternTile, GamePaletteWithColors } from "../../types";
import useSizedCanvasEffect from "../../shared/utils/use-sized-canvas-effect";
import useDrawTilesEffect from "./use-draw-tiles-effect";

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scaling: number; // in range [1, ...]
  tiles: Array<PatternTile>;
  palette: GamePaletteWithColors;
  ariaLabel: string;
};

const PatternTableCanvas = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  palette,
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

  useDrawTilesEffect(canvasRef, tiles, palette, tilesInColumn, scaling);

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
