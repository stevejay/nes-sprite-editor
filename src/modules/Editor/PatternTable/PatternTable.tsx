import React from "react";
import useSizedCanvasEffect from "../../../shared/utils/use-sized-canvas-effect";
import { GamePaletteWithColors, PatternTile } from "../../../types";
import styles from "./PatternTable.module.scss";
import useDrawTilesEffect from "./use-draw-tiles-effect";

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scale: number; // in range [1, ...]
  tiles: Array<PatternTile>;
  palette: GamePaletteWithColors;
  ariaLabel: string;
};

const PatternTable = ({
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
    tilesInColumn * PIXEL_COLUMNS_PER_TILE,
    tilesInRow * PIXEL_ROWS_PER_TILE,
    scale
  );

  useDrawTilesEffect(canvasRef, tiles, palette, tilesInColumn, scale);

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

export default PatternTable;
