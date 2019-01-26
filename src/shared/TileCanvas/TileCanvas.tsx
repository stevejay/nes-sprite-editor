import React from "react";
import styles from "./TileCanvas.module.scss";
import { GamePaletteWithColors } from "../../reducer";
import { Tile, Color } from "../../types";
import useSizedCanvasEffect from "../utils/use-sized-canvas-effect";
import useDrawTilesEffect from "./use-draw-tiles-effect";

const PIXEL_ROWS_PER_TILE = 8;
const PIXEL_COLUMNS_PER_TILE = PIXEL_ROWS_PER_TILE;

type Props = {
  tilesInRow: number;
  tilesInColumn: number;
  scaling: number; // 1+
  tiles: Array<Tile>;
  backgroundColor: Color;
  palettes: Array<GamePaletteWithColors>;
  ariaLabel: string;
};

const TileCanvas: React.FunctionComponent<Props> = ({
  tilesInRow,
  tilesInColumn,
  scaling,
  tiles,
  backgroundColor,
  palettes,
  ariaLabel
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    tilesInRow,
    tilesInColumn,
    scaling * PIXEL_ROWS_PER_TILE,
    scaling * PIXEL_COLUMNS_PER_TILE
  );

  useDrawTilesEffect(
    canvasRef,
    tiles,
    backgroundColor,
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

export default TileCanvas;
